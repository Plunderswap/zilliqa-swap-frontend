import { DismissableLayer } from "@radix-ui/react-dismissable-layer";
import React, { createContext, useCallback, useState } from "react";
import { createPortal } from "react-dom";
import { BoxProps } from "../../components/Box";
import { Overlay } from "../../components/Overlay";
import getPortalRoot from "../../util/getPortalRoot";
import { StyledModalWrapper } from "./ModalContext";

export interface ModalV2Props {
  isOpen?: boolean;
  onDismiss?: () => void;
  closeOnOverlayClick?: boolean;
  children?: React.ReactNode;
}

export const ModalV2Context = createContext<{
  onDismiss?: () => void;
}>({});

export type UseModalV2Props = ReturnType<typeof useModalV2>;
export function useModalV2() {
  const [isOpen, setIsOpen] = useState(false);

  const onDismiss = useCallback(() => setIsOpen(false), []);
  const onOpen = useCallback(() => setIsOpen(true), []);

  return {
    onDismiss,
    onOpen,
    isOpen,
    setIsOpen,
  };
}

export function ModalV2({
  isOpen,
  onDismiss,
  closeOnOverlayClick,
  children,
  disableOutsidePointerEvents = false,
  ...props
}: ModalV2Props & BoxProps & { disableOutsidePointerEvents?: boolean }) {
  const handleOverlayDismiss = (e: any) => {
    e.stopPropagation();
    e.preventDefault();
    if (closeOnOverlayClick) {
      onDismiss?.();
    }
  };
  const portal = getPortalRoot();

  if (portal) {
    return createPortal(
      <ModalV2Context.Provider value={{ onDismiss }}>
        {isOpen && (
          <DismissableLayer
            role="dialog"
            disableOutsidePointerEvents={disableOutsidePointerEvents}
            onEscapeKeyDown={handleOverlayDismiss}
          >
            <StyledModalWrapper {...(props as any)}>
              <Overlay onClick={handleOverlayDismiss} />
              {children}
            </StyledModalWrapper>
          </DismissableLayer>
        )}
      </ModalV2Context.Provider>,
      portal,
    );
  }

  return null;
}
