import {Link, Store} from '../store/model';
import {Print, logger} from '../logger';
import {config} from '../config';
//@ts-ignore
import RocketChatApi from 'rocketchat-api';

const rocketchat = config.notifications.rocketchat;
const username = rocketchat.username;
const password = rocketchat.password;
const url = rocketchat.url;
const protocol = (rocketchat.useHttps) ? "https" : "http";
const port = rocketchat.port;
const messageAlias = rocketchat.alias;
const roomName = rocketchat.roomName;

const rocketChatClient = new RocketChatApi(protocol,url,port)


export function sendRocketchatMessage(link: Link, store: Store) {
	if (rocketChatClient) {
		logger.debug('↗ sending rocketchat message');
		(async () => {
			const givenUrl = link.cartUrl ? link.cartUrl : link.url;
			try {
                const login = await rocketChatClient.login(username, password);
                const post1 = await rocketChatClient.chat.postMessage({channel: roomName, alias: messageAlias, text: "@all (testing) STOCK ALERT :hype:"});
                const post2 = await rocketChatClient.chat.postMessage({channel: roomName, alias: messageAlias, text: `${Print.inStock(link, store)}\n${givenUrl}`});
				logger.info('✔ rocket message sent');
			} catch (error: unknown) {
				logger.error("✖ couldn't send rocket message", error);
			}
		})();
	}
}
