import React from 'react';
import config from '../config.json';
import { Modal, Button, Overlay, OverlayTrigger, Tooltip } from 'react-bootstrap';
import Link from 'next/link';

function WizScoreRowTooltip(props) {
    return (
        <Tooltip>
            props.tooltip
        </Tooltip>
    );
}

function WizScoreRow(props) {

    const renderTooltip = () => (
        <Tooltip>
          {props.tooltip}
        </Tooltip>
      );

    let thresholdColor = 'text-black';
    if(props.color=='green') {
        thresholdColor = 'text-success';
    }
    else if(props.color=='red') {
        thresholdColor = 'text-danger';
    }
    let color = 'text-black';
    if(props.inverse) {
        color = (props.score < props.threshold) ? thresholdColor : 'text-black';
    }
    else {
        color = (props.score > props.threshold) ? thresholdColor : 'text-black';
    }
    let score = (props.addPercent) ? props.score+'%' : props.score;
    if(props.sign!=undefined) score = props.sign+score;
    return (
                <tr> 
                    <th scope="row">
                        {props.label}
                        <OverlayTrigger
                            placement='right'    
                            overlay={renderTooltip()}
                        >
                            <i className="bi bi-info ps-2"></i>
                        </OverlayTrigger>
                    </th>
                    <td>
                        {props.value}
                    </td>
                    <td className={color}>
                        {score}
                    </td>
                </tr>
    );
}

class WizScoreBody extends React.Component {
    
    renderInfoCount() {
        return (this.props.validator.info_score / 2)
    }

    renderWithdrawAuthorityValue() {
        if(this.props.validator.withdraw_authority_score==0) {
            return 'Differs from validator identity (good)';
        }
        else {
            return 'Set to validator identity (security risk)';
        }
    }

    renderSuperminorityValue() {
        if(this.props.validator.superminority_penalty==0) {
            return 'Below superminority	';
        }
        else {
            return 'In the superminority';
        }
    }

    renderCommissionAlert() {
        if(this.props.validator.commission>10) {
            return (
                <div className="bg-danger text-white p-2 m-2 text-center">
                    Validator&apos;s commission is above 10%. We override their score to 0%.
                </div>
            );
        }
        else return null;
    }

    renderNoVotingAlert() {
        if(this.props.validator.no_voting_override>10) {
            return (
                <div className="bg-danger text-white p-2 m-2 text-center">
                    Validator hasn&apos;t voted this epoch. We override their score to 0%.
                </div>
            );
        }
        else return null;
    }

    renderWizScore() {
        let color = 'bg-danger';
        if(this.props.validator.rank <= config.WIZ_SCORE_RANK_GROUPS.TOP) {
            color = 'bg-success';
        }
        else if(this.props.validator.rank <= config.WIZ_SCORE_RANK_GROUPS.MEDIUM) {
            color = 'bg-warning';
        }
        return (
            <div className="row">
                <div className={"col text-center text-white fst-italic p-3 mx-5 rounded "+color}>
                    <h5 className="mb-0">
                        WIZ SCORE: 
                            <span id="scorecard-wizscore">
                            {' '+new Intl.NumberFormat().format(Number(this.props.validator.wiz_score).toFixed(2))+'% '}
                            </span> 
                            (RANK 
                                <span id="scorecard-wizrank">
                                    {' '+this.props.validator.rank}
                                </span>
                                )
                    </h5>
                </div>
            </div>
        );
    }

    renderBody() {
        let body =  (
            <div>
                        <p>
                            This score helps users pick good validators to stake with. 
                            It&apos;s designed to rewards behaviour that benefits the network and penalize behaviour that 
                            harms the network (e.g. centralization of stake). We periodically update our weighting and 
                            metrics used, but record the version with each score. The score below is using version&nbsp;
                            <span id="scorecard-scoreversion">
                               {this.props.validator.score_version}
                            </span>. You can read the full details of the current version&apos;s weightings&nbsp; 
                            <Link href="/faq#faq-wizscore" target="_new" passHref>here</Link>.
                        </p>
                        <table className="table table-sm"> 
                            <thead>
                                <tr> 
                                    <th scope="col">
                                        Category 
                                    </th>
                                    <th scope="col">
                                        Value 
                                    </th>
                                    <th className="td-min-width" scope="col">
                                        Score
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                <WizScoreRow
                                    label='Vote Success'
                                    tooltip="Ratio of credits vs slots completed this epoch."
                                    value={this.props.validator.vote_success+'%'}
                                    score={this.props.validator.vote_success_score}
                                    addPercent='true'
                                    threshold='0'
                                    color='green'
                                    sign='+'
                                /> 
                                <WizScoreRow
                                    label='Slot Skip Rate'
                                    tooltip="Percentage of leader slots in which this validator failed to produce a block."
                                    value={new Intl.NumberFormat().format(Number(this.props.validator.skip_rate).toFixed(1))+'%'}
                                    score={this.props.validator.skip_rate_score}
                                    addPercent='true'
                                    threshold='0'
                                    color='green'
                                    sign='+'
                                /> 
                                <WizScoreRow
                                    label='Published Information'
                                    tooltip="2% for each of these: name, logo, description, keybase ID &amp; website."
                                    value={this.renderInfoCount()+' out of 5'}
                                    score={this.props.validator.info_score}
                                    addPercent='true'
                                    threshold='0'
                                    color='green'
                                    sign='+'
                                /> 
                                <WizScoreRow
                                    label='Commission'
                                    tooltip="Up to +5% score for commission of 0%. No score for 10% commission and above."
                                    value={this.props.validator.commission+'%'}
                                    score={this.props.validator.commission_score}
                                    addPercent='true'
                                    threshold='0'
                                    color='green'
                                    sign='+'
                                /> 
                                <WizScoreRow
                                    label='Operating History'
                                    tooltip="Up to +10% for having at least 10 epoch history (counted from first epoch with stake)."
                                    value={this.props.validator.first_epoch_distance+' epochs'}
                                    score={this.props.validator.epoch_distance_score}
                                    addPercent='true'
                                    threshold='0'
                                    color='green'
                                    sign='+'
                                /> 
                                <WizScoreRow
                                    label='Stake Weight'
                                    tooltip="Up to +15%, 0% for any stake that is >= 10% of the largest validator's stake."
                                    value={this.props.validator.stake_weight+'%'}
                                    score={this.props.validator.stake_weight_score}
                                    addPercent='true'
                                    threshold='0'
                                    color='green'
                                    sign='+'
                                />
                                <WizScoreRow
                                    label='Withdraw Authority'
                                    tooltip="Having the vote account withdraw authority set to the validator's identity keypair is a bad security practice and incurs a -20% penalty."
                                    value={this.renderWithdrawAuthorityValue()}
                                    score={this.props.validator.withdraw_authority_score}
                                    addPercent='true'
                                    threshold='0'
                                    color='red'
                                    inverse='true'
                                />
                                <WizScoreRow
                                    label={'ASN Concentration ('+this.props.validator.ip_asn+')'}
                                    tooltip="Stake concentration by ASN (ASN can comprise multiple physical locations). Penalty applied relative to the highest-staked ASN (which incurs the max penalty)."
                                    value={this.props.validator.asn_concentration+'%'}
                                    score={this.props.validator.asn_concentration_score}
                                    addPercent='true'
                                    threshold='0'
                                    color='red'
                                    inverse='true'
                                />
                                <WizScoreRow
                                    label={'City Concentration ('+this.props.validator.ip_city+')'}
                                    tooltip="Stake concentration by City (city can comprise multiple data centres). Penalty applied relative to the highest-staked city (which incurs the max penalty)."
                                    value={this.props.validator.city_concentration+'%'}
                                    score={this.props.validator.city_concentration_score}
                                    addPercent='true'
                                    threshold='0'
                                    color='red'
                                    inverse='true'
                                />
                                <WizScoreRow
                                    label={'ASN + City Concentration ('+this.props.validator.ip_asn+' + '+this.props.validator.ip_city+')'}
                                    tooltip="Stake concentration by City (city can comprise multiple data centres). Penalty applied relative to the highest-staked city (which incurs the max penalty)."
                                    value={this.props.validator.asncity_concentration+'%'}
                                    score={this.props.validator.asncity_concentration_score}
                                    addPercent='true'
                                    threshold='0'
                                    color='red'
                                    inverse='true'
                                />
                                <WizScoreRow
                                    label='Uptime (30 days)'
                                    tooltip="Percentage of time a validator was not delinquent over the past 30 days (or since the validator was added to our database if less than 30 days)."
                                    value={this.props.validator.uptime+'%'}
                                    score={this.props.validator.uptime_score}
                                    addPercent='true'
                                    threshold='0'
                                    color='green'
                                    sign='+'
                                />
                                <WizScoreRow
                                    label='Version Penalty'
                                    tooltip="A penalty is applied for running an outdated or not recommended software version."
                                    value={this.props.validator.version}
                                    score={this.props.validator.invalid_version_score}
                                    addPercent='true'
                                    threshold='0'
                                    color='red'
                                    inverse='true'
                                />
                                <WizScoreRow
                                    label='Superminority Penalty'
                                    tooltip="A penalty is applied to validators in the superminority (highest 33.3% of stake weight)."
                                    value={this.renderSuperminorityValue()}
                                    score={this.props.validator.superminority_penalty}
                                    addPercent='true'
                                    threshold='0'
                                    color='red'
                                    inverse='true'
                                />
                            </tbody>
                        </table>
                        {this.renderCommissionAlert()}
                        {this.renderNoVotingAlert()}
                        {this.renderWizScore()}
                    </div>
        );

        return body;
    }

    render() {
        return this.renderBody();
    }
}

class WizScore extends React.Component {
    renderName() {
        
        if(this.props.validator!=null) {
            return this.props.validator.name;
        }
        else {
            return 'Validator Not Chosen';
        }
    }

    renderWizScoreBody() {
        if(this.props.validator!=null) {
            return <WizScoreBody validator={this.props.validator} />
        }
        else {
            return null;
        }
    }
    
    render() {
        return (
            <Modal show={this.props.showWizModal} onHide={this.props.hideWizModal} dialogClassName='modal-lg'>
                <Modal.Header closeButton>
                    <Modal.Title>{this.renderName()}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {this.renderWizScoreBody()}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={this.props.hideWizModal}>
                    Close
                    </Button>
                </Modal.Footer>
            </Modal>
        );
        }
}
export default WizScore;