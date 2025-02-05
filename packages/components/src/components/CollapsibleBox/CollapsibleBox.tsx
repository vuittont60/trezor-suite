import { useState, useEffect, useCallback, ReactNode, FC, HtmlHTMLAttributes } from 'react';
import { motion } from 'framer-motion';
import styled, { css } from 'styled-components';
import { Icon } from '../assets/Icon/Icon';
import * as variables from '../../config/variables';
import * as motionConfig from '../../config/motion';

const animationVariants = {
    closed: {
        opacity: 0,
        height: 0,
    },
    expanded: {
        opacity: 1,
        height: 'auto',
    },
};

const Wrapper = styled.div<Pick<CollapsibleBoxProps, 'variant'>>`
    display: flex;
    flex-direction: column;
    background: ${({ theme }) => theme.BG_GREY};
    margin-bottom: 20px;

    ${({ variant }) =>
        (variant === 'tiny' || variant === 'small') &&
        css`
            border-radius: 4px;
        `}

    ${({ variant, theme }) =>
        variant === 'large' &&
        css`
            border-radius: 16px;
            box-shadow: 0 2px 5px 0 ${theme.BOX_SHADOW_BLACK_20};
        `}
`;

const Header = styled.div<Pick<CollapsibleBoxProps, 'variant' | 'headerJustifyContent'>>`
    display: flex;
    justify-content: ${({ headerJustifyContent }) => headerJustifyContent};
    align-items: center;
    cursor: pointer;

    ${({ variant }) =>
        variant === 'tiny' &&
        css`
            padding: 8px 16px;
        `}

    ${({ variant }) =>
        variant === 'small' &&
        css`
            padding: 12px 16px;
        `}

    ${({ variant }) =>
        variant === 'large' &&
        css`
            padding: 24px 30px;

            ${variables.SCREEN_QUERY.MOBILE} {
                padding: 24px 18px;
            }
        `}
`;

const IconWrapper = styled.div<Pick<CollapsibleBoxProps, 'headerJustifyContent'>>`
    display: flex;
    align-items: center;
    overflow: hidden;
    margin-left: 24px;
    padding-left: ${({ headerJustifyContent }) => headerJustifyContent === 'center' && '2px'};
`;

const IconLabel = styled.div`
    margin-right: 6px;
    margin-left: 28px;
    color: ${({ theme }) => theme.TYPE_LIGHT_GREY};
    font-size: ${variables.FONT_SIZE.SMALL};
    font-weight: ${variables.FONT_WEIGHT.MEDIUM};
`;

const Heading = styled.span<Pick<CollapsibleBoxProps, 'variant'>>`
    display: flex;
    align-items: center;
    color: ${({ theme }) => theme.TYPE_LIGHT_GREY};
    font-weight: ${variables.FONT_WEIGHT.MEDIUM};

    ${({ variant }) =>
        variant === 'tiny' &&
        css`
            font-size: ${variables.NEUE_FONT_SIZE.NANO};
        `}

    ${({ variant }) =>
        (variant === 'small' || variant === 'large') &&
        css`
            font-size: ${variables.NEUE_FONT_SIZE.SMALL};
        `}
`;

const Content = styled.div<{
    variant: CollapsibleBoxProps['variant'];
    $noContentPadding?: boolean;
}>`
    display: flex;
    flex-direction: column;
    overflow: hidden;
    border-top: 1px solid ${({ theme }) => theme.STROKE_GREY};

    ${({ $noContentPadding, variant }) =>
        !$noContentPadding &&
        variant === 'tiny' &&
        css`
            padding: 15px 16px;
        `}

    ${({ $noContentPadding, variant }) =>
        !$noContentPadding &&
        variant === 'small' &&
        css`
            padding: 20px 16px;
        `}

    ${({ $noContentPadding, variant }) =>
        !$noContentPadding &&
        variant === 'large' &&
        css`
            padding: 20px 30px;
        `}
`;

const Collapser = styled(motion.div)`
    overflow: hidden;
`;

interface CollapsibleBoxProps extends HtmlHTMLAttributes<HTMLDivElement> {
    heading: ReactNode;
    variant: 'tiny' | 'small' | 'large';
    iconLabel?: ReactNode;
    children?: ReactNode;
    noContentPadding?: boolean;
    headerJustifyContent?: 'space-between' | 'center';
    opened?: boolean;
    onCollapse?: () => void;
    headingButton?: ({
        collapsed,
        animatedIcon,
    }: {
        collapsed: boolean;
        animatedIcon: boolean;
    }) => ReactNode;
}

type CollapsibleBoxSubcomponents = {
    Header: typeof Header;
    Heading: typeof Heading;
    Content: typeof Content;
    IconWrapper: typeof IconWrapper;
};

const CollapsibleBox: FC<CollapsibleBoxProps> & CollapsibleBoxSubcomponents = ({
    heading,
    iconLabel,
    children,
    noContentPadding,
    variant = 'small',
    headerJustifyContent = 'space-between',
    opened = false,
    onCollapse,
    headingButton,
    ...rest
}: CollapsibleBoxProps) => {
    const [collapsed, setCollapsed] = useState(!opened);
    const [animatedIcon, setAnimatedIcon] = useState(false);

    useEffect(() => {
        setCollapsed(!opened);
    }, [opened]);

    const handleHeaderClick = useCallback(() => {
        onCollapse?.();
        setCollapsed(!collapsed);
        setAnimatedIcon(true);
    }, [collapsed, onCollapse]);

    return (
        <Wrapper variant={variant} {...rest}>
            <Header
                variant={variant}
                headerJustifyContent={headerJustifyContent}
                onClick={handleHeaderClick}
            >
                <Heading variant={variant}>{heading ?? iconLabel}</Heading>

                {headingButton ? (
                    headingButton({ collapsed, animatedIcon })
                ) : (
                    <IconWrapper headerJustifyContent={headerJustifyContent}>
                        {heading && iconLabel && <IconLabel>{iconLabel}</IconLabel>}
                        <Icon
                            icon="ARROW_DOWN"
                            size={variant === 'tiny' ? 12 : 20}
                            canAnimate={animatedIcon}
                            isActive={!collapsed}
                        />
                    </IconWrapper>
                )}
            </Header>

            <Collapser
                initial={false} // Prevents animation on mount when expanded === false
                variants={animationVariants}
                animate={!collapsed ? 'expanded' : 'closed'}
                transition={{ duration: 0.4, ease: motionConfig.motionEasing.transition }}
                data-test="@collapsible-box/body"
            >
                <Content variant={variant} $noContentPadding={noContentPadding}>
                    {children}
                </Content>
            </Collapser>
        </Wrapper>
    );
};

CollapsibleBox.Header = Header;
CollapsibleBox.Heading = Heading;
CollapsibleBox.Content = Content;
CollapsibleBox.IconWrapper = IconWrapper;

export { CollapsibleBox };
