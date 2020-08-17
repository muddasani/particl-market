// Copyright (c) 2017-2020, The Particl Market developers
// Distributed under the GPL software license, see the accompanying
// file COPYING or https://github.com/particl/particl-market/blob/develop/LICENSE

import * as resources from 'resources';
import { inject, named } from 'inversify';
import { Logger as LoggerType } from '../../../core/Logger';
import { Core, Targets, Types } from '../../../constants';
import { VoteMessage } from '../../messages/action/VoteMessage';
import { GovernanceAction } from '../../enums/GovernanceAction';
import { MessageFactoryInterface } from './MessageFactoryInterface';
import { VoteRequest } from '../../requests/action/VoteRequest';
import { CoreRpcService } from '../../services/CoreRpcService';
import { VerifiableMessage } from './ListingItemAddMessageFactory';

// todo: move
export interface VoteTicket extends VerifiableMessage {
    proposalHash: string;       // proposal being voted for
    proposalOptionHash: string; // proposal option being voted for
    address: string;            // voting address having balance
}

export class VoteMessageFactory implements MessageFactoryInterface {

    public log: LoggerType;

    constructor(
        @inject(Types.Service) @named(Targets.Service.CoreRpcService) public coreRpcService: CoreRpcService,
        @inject(Types.Core) @named(Core.Logger) public Logger: typeof LoggerType
    ) {
        this.log = new Logger(__filename);
    }

    /**
     *
     * @param actionRequest
     * @returns {Promise<VoteMessage>}
     */
    public async get(actionRequest: VoteRequest): Promise<VoteMessage> {

        const signature = await this.signVote(actionRequest.sendParams.wallet, actionRequest.proposal, actionRequest.proposalOption,
            actionRequest.addressInfo.address);

        const voteMessage = {
            type: GovernanceAction.MPA_VOTE,
            proposalHash: actionRequest.proposal.hash,
            proposalOptionHash: actionRequest.proposalOption.hash,
            signature,
            voter: actionRequest.addressInfo.address
        } as VoteMessage;

        return voteMessage;
    }


    /**
     * signs the VoteTicket, returns signature
     *
     * @param wallet
     * @param proposal
     * @param proposalOption
     * @param address
     */
    private async signVote(wallet: string, proposal: resources.Proposal, proposalOption: resources.ProposalOption, address: string): Promise<string> {
        const voteTicket = {
            proposalHash: proposal.hash,
            proposalOptionHash: proposalOption.hash,
            address
        } as VoteTicket;

        this.log.debug('voteTicket:', JSON.stringify(voteTicket, null, 2));
        return await this.coreRpcService.signMessage(wallet, address, voteTicket);
    }

}
