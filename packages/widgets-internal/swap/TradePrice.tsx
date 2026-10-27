import { Price, Currency } from "@dex/swap-sdk-core";
import { formatPrice } from "@dex/utils/formatFractions";
import { useState } from "react";
import styled from "styled-components";
import { AtomBox, SyncAltIcon, AutoRenewIcon, Text, Loading } from "@dex/uikit";

interface TradePriceProps {
  price?: Price<Currency, Currency>;
  loading?: boolean;
}

const IconButton = styled(AtomBox)`
  border-radius: 50%;
  cursor: pointer;
  color: ${({ theme }) => theme.colors.text};
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0.2rem;
  font-size: 0.875rem;
  border: none;
  height: 22px;
  width: 22px;
  font-weight: 400;
  margin-left: 0.4rem;
  float: right;
`;

export function TradePrice({ price, loading }: TradePriceProps) {
  const [showInverted, setShowInverted] = useState<boolean>(false);

  const formattedPrice = showInverted ? formatPrice(price, 6) : formatPrice(price?.invert(), 6);
  const show = Boolean(price?.baseCurrency && price?.quoteCurrency);

  return (
    <Text
      fontSize="14px"
      style={{ justifyContent: "center", alignItems: "center", display: "flex", opacity: loading ? 0.6 : 1 }}
    >
      {show ? (
        <>
          {`1 ${showInverted ? price?.baseCurrency?.symbol : price?.quoteCurrency?.symbol}`}
          <SyncAltIcon width="14px" height="14px" color="textSubtle" ml="4px" mr="4px" />
          {`${formattedPrice} ${showInverted ? price?.quoteCurrency?.symbol : price?.baseCurrency?.symbol}`}
          {loading ? (
            <IconButton>
              <Loading width="12px" height="12px" />
            </IconButton>
          ) : (
            <IconButton role="button" onClick={() => setShowInverted(!showInverted)}>
              <AutoRenewIcon width="14px" />
            </IconButton>
          )}
        </>
      ) : (
        "-"
      )}
    </Text>
  );
}
