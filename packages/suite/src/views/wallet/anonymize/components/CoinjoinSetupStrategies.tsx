import React, { useState } from 'react';
import styled from 'styled-components';

import { Button, Card, Checkbox, Link, Tooltip, variables } from '@trezor/components';
import { startCoinjoinSession } from '@wallet-actions/coinjoinAccountActions';
import { Translation } from '@suite-components';
import { useActions } from '@suite-hooks';
import { Account } from '@suite-common/wallet-types';
import { CryptoAmountWithHeader } from '@wallet-components/PrivacyAccount/CryptoAmountWithHeader';
import { CoinjoinCustomStrategy } from './CoinjoinCustomStrategy';
import {
    CoinjoinDefaultStrategy,
    COINJOIN_STRATEGIES,
    CoinJoinStrategy,
} from './CoinjoinDefaultStrategy';

const StyledCard = styled(Card)`
    margin-bottom: 8px;
`;

const Row = styled.div`
    border-bottom: 1px solid ${({ theme }) => theme.STROKE_GREY};
    display: flex;
    gap: 50px;
    margin: 20px 0;
    padding-bottom: 30px;
`;

const StyledCryptoAmountWithHeader = styled(CryptoAmountWithHeader)`
    flex-basis: 50%;
`;

const Heading = styled.div`
    font-size: ${variables.FONT_SIZE.H3};
    font-weight: ${variables.FONT_WEIGHT.MEDIUM};
`;

const ConfirmationsHeading = styled(Heading)`
    margin-bottom: 4px;
`;

const AmountHeading = styled.div`
    color: ${({ theme }) => theme.TYPE_GREEN};
`;

const StyledCheckbox = styled(Checkbox)`
    margin-top: 16px;
    font-weight: ${variables.FONT_WEIGHT.MEDIUM};
`;

const StyledLink = styled(Link)`
    text-decoration: underline;
`;

const StyledButton = styled(Button)`
    margin: 24px auto 0 auto;

    :disabled {
        background: ${({ theme }) => theme.STROKE_GREY};
    }
`;

interface CoinjoinSetupStrategiesProps {
    account: Account;
}

export const CoinjoinSetupStrategies = ({ account }: CoinjoinSetupStrategiesProps) => {
    const [strategy, setStrategy] = useState<CoinJoinStrategy>('recommended');
    const [connectedConfirmed, setConnectedConfirmed] = useState(false);
    const [termsConfirmed, setTermsConfirmed] = useState(false);

    const actions = useActions({
        startCoinjoinSession,
    });

    const isCustom = strategy === 'custom';
    const allChecked = connectedConfirmed && termsConfirmed;
    const fee = (Number(account.balance) * 0.003).toString();

    const reset = () => setStrategy('recommended');
    const toggleConnectConfirmation = () => setConnectedConfirmed(current => !current);
    const toggleTermsConfirmation = () => setTermsConfirmed(current => !current);
    const anonymize = () =>
        actions.startCoinjoinSession(
            account,
            COINJOIN_STRATEGIES[strategy === 'custom' ? 'recommended' : strategy], // TODO: enable custom strategy
        );

    return (
        <>
            <StyledCard>
                <Heading>
                    <Translation id="TR_START_ANONYMISATION" />
                </Heading>
                <Row>
                    <StyledCryptoAmountWithHeader
                        header={
                            <AmountHeading>
                                <Translation id="TR_AMOUNT" />
                            </AmountHeading>
                        }
                        value={account.balance}
                        symbol={account.symbol}
                    />
                    <StyledCryptoAmountWithHeader
                        header={
                            <AmountHeading>
                                <Translation id="TR_SERVICE_FEE" />
                            </AmountHeading>
                        }
                        value={fee}
                        symbol={account.symbol}
                        note={<Translation id="TR_SERVICE_FEE_NOTE" />}
                    />
                </Row>
                {isCustom ? (
                    <CoinjoinCustomStrategy reset={reset} />
                ) : (
                    <CoinjoinDefaultStrategy strategy={strategy} setStrategy={setStrategy} />
                )}
            </StyledCard>

            <StyledCard>
                <ConfirmationsHeading>
                    <Translation id="TR_CONFIRMATIONS" />
                </ConfirmationsHeading>
                <StyledCheckbox isChecked={connectedConfirmed} onClick={toggleConnectConfirmation}>
                    <Translation id="TR_DEVICE_CONNECTED_CONFIRMATION" />
                </StyledCheckbox>
                <StyledCheckbox isChecked={termsConfirmed} onClick={toggleTermsConfirmation}>
                    <Translation
                        id="TR_TERMS_AND_PRIVACY_CONFIRMATION"
                        values={{
                            privacy: chunks => (
                                <StyledLink href="https://trezor.io">{chunks}</StyledLink>
                            ), // TODO: replace URL
                            terms: chunks => (
                                <StyledLink href="https://trezor.io">{chunks}</StyledLink>
                            ), // TODO: replace URL
                        }}
                    />
                </StyledCheckbox>
            </StyledCard>

            <Tooltip
                content={<Translation id="TR_ANONYMISATION_BUTTON_DISABLED" />}
                interactive={false}
                disabled={!allChecked}
            >
                <StyledButton isDisabled={!allChecked} onClick={anonymize}>
                    <Translation id="TR_ANONYMIZE" />
                </StyledButton>
            </Tooltip>
        </>
    );
};