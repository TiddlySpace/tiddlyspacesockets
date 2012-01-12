
import beanstalkc
import logging

from tiddlywebplugins.utils import get_store
from tiddlywebplugins.dispatcher.listener import Listener as BaseListener

from tiddlyweb.store import StoreError
from tiddlyweb.model.bag import Bag
from tiddlyweb.model.policy import PermissionsError
from tiddlyweb.model.tiddler import Tiddler
from tiddlyweb.web.util import encode_name
from tiddlyweb.serializer import Serializer

OUTGOING_TUBE = 'socketuri'

from tiddlywebplugins.dispatcher import (make_beanstalkc,
        DEFAULT_BEANSTALK_HOST, DEFAULT_BEANSTALK_PORT)


class Listener(BaseListener):

    TUBE = 'socketinfo'
    STORE = None

    def run(self):
        config = self._kwargs['config']
        self.serializer = Serializer('json', {'tiddlyweb.config': config})
        beanstalk_host = config.get('beanstalk.host', DEFAULT_BEANSTALK_HOST)
        beanstalk_port = config.get('beanstalk.port', DEFAULT_BEANSTALK_PORT)
        self.beanstalkc = make_beanstalkc(beanstalk_host, beanstalk_port)
        BaseListener.run(self)

    def _act(self, job):
        info = self._unpack(job)
        if not self.STORE:
            self.STORE = get_store(self.config)

        tiddler = Tiddler(info['tiddler'], info['bag'])
        try:
            self.STORE.get(tiddler)
        except StoreError, exc:
            return None  # Tiddler's not there

        # this tiddler in a readable bag?
        try:
            bag = self.STORE.get(Bag(tiddler.bag))
            usersign = {'name': 'GUEST', 'roles': []}
            bag.policy.allows(usersign, 'read')
        except (StoreError, PermissionsError):
            return None  # GUEST can't read, so sorry.

        uri = self._make_uri(tiddler)

        logging.debug('twsock listener sending %s', uri)
        tiddler.text = ''
        tiddler.fields['_uri'] = uri
        self.serializer.object = tiddler
        try:
            self.beanstalkc.use(OUTGOING_TUBE)
            self.beanstalkc.put(self.serializer.to_string())
        except beanstalkc.SocketError, exc:
            logging.error('dispatch to twsock failed, retry: %s', exc)
            beanstalk_host = self.config.get('beanstalk.host',
                    DEFAULT_BEANSTALK_HOST)
            beanstalk_port = self.config.get('beanstalk.port',
                    DEFAULT_BEANSTALK_PORT)
            self.beanstalkc = make_beanstalkc(beanstalk_host, beanstalk_port)
            self._act(job)

    def _make_uri(self, tiddler):
        config = self._kwargs['config']
        server_prefix = config['server_prefix']
        return '%s/bags/%s/tiddlers/%s' % (server_prefix,
                encode_name(tiddler.bag),
                encode_name(tiddler.title))
