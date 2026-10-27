import React, { useContext } from "react";
import { styled } from "styled-components";
import Flex from "../../../components/Box/Flex";
import { LogoIcon } from "../../../components/Svg";
import Text from "../../../components/Text/Text";
import { MenuContext } from "../context";

interface Props {
  href: string;
  appName: string;
}

const StyledLink = styled("a")`
  display: flex;
  align-items: center;
  .app-name {
    display: none;
    ${({ theme }) => theme.mediaQueries.xl} {
      display: block;
    }
  }
`;

const Logo: React.FC<React.PropsWithChildren<Props>> = ({ href, appName }) => {
  const { linkComponent } = useContext(MenuContext);
  const isAbsoluteUrl = href.startsWith("http");
  const innerLogo = (
    <>
      <LogoIcon width="32px" />
      <Text className="app-name" bold fontSize="20px" ml="8px">
        {appName}
      </Text>
    </>
  );

  return (
    <Flex alignItems="center">
      {isAbsoluteUrl ? (
        <StyledLink as="a" href={href} aria-label={`${appName} home page`}>
          {innerLogo}
        </StyledLink>
      ) : (
        <StyledLink href={href} as={linkComponent} aria-label={`${appName} home page`}>
          {innerLogo}
        </StyledLink>
      )}
    </Flex>
  );
};

export default React.memo(Logo);
