import { useIsMounted } from "@dex/hooks";
import React from "react";
import { Box, Flex } from "../Box";
import { Link } from "../Link";
import {
  StyledFooter,
  StyledIconMobileContainer,
  StyledList,
  StyledListItem,
  StyledText,
  StyledToolsContainer,
} from "./styles";

import { vars } from "../../css/vars";
import { darkColors } from "../../theme/colors";
import { LogoIcon } from "../Svg";
import Text from "../Text/Text";
import { ThemeSwitcher } from "../ThemeSwitcher";
import { FooterProps } from "./types";

const FooterLogo: React.FC<{ appName: string }> = ({ appName }) => (
  <Flex alignItems="center">
    <LogoIcon width="32px" mr="8px" />
    <Text bold fontSize="20px" color={darkColors.text}>
      {appName}
    </Text>
  </Flex>
);

const MenuItem: React.FC<React.PropsWithChildren<FooterProps>> = ({
  appName,
  items,
  isDark,
  toggleTheme,
  ...props
}) => {
  const isMounted = useIsMounted();
  return (
    <StyledFooter
      data-theme="dark"
      p={["40px 16px", null, "56px 40px 32px 40px"]}
      position="relative"
      {...props}
      justifyContent="center"
    >
      <Flex flexDirection="column" width={["100%", null, "1200px;"]}>
        <StyledIconMobileContainer display={["block", null, "none"]}>
          <FooterLogo appName={appName} />
        </StyledIconMobileContainer>
        <Flex
          order={[2, null, 1]}
          flexDirection={["column", "column", "column", "column", "row", "row"]}
          justifyContent="space-between"
          alignItems="flex-start"
          mb={["42px", null, "36px"]}
        >
          {items?.map((item) => (
            <StyledList key={item.label}>
              <StyledListItem>{item.label}</StyledListItem>
              {item.items?.map(({ label, href, isHighlighted = false }) => (
                <StyledListItem key={label}>
                  {href ? (
                    <Link
                      data-theme="dark"
                      href={href}
                      target="_blank"
                      rel="noreferrer noopener"
                      color={isHighlighted ? vars.colors.warning : "text"}
                      bold={false}
                    >
                      {label}
                    </Link>
                  ) : (
                    <StyledText>{label}</StyledText>
                  )}
                </StyledListItem>
              ))}
            </StyledList>
          ))}
          <Box display={["none", null, "block"]}>
            <FooterLogo appName={appName} />
          </Box>
        </Flex>
        <StyledToolsContainer
          data-theme="dark"
          order={[1, null, 3]}
          flexDirection={["column", null, "row"]}
          justifyContent="space-between"
        >
          <Flex order={[2, null, 1]} alignItems="center">
            {isMounted && <ThemeSwitcher isDark={isDark} toggleTheme={toggleTheme} />}
          </Flex>
        </StyledToolsContainer>
      </Flex>
    </StyledFooter>
  );
};

export default MenuItem;
