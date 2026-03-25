import type { ReactNode } from "react";
import type { ModalProps as RNModalProps, ViewStyle } from "react-native";
import { Pressable, Modal as RNModal, StyleSheet, View } from "react-native";
import {
  colors,
  RN_MODAL_PRESENTATION,
  type RNModalPresentation,
  radius,
  spacing,
  zIndex,
} from "../../theme";

const MODAL_PRESENTATION_STYLE: Record<
  RNModalPresentation,
  RNModalProps["presentationStyle"]
> = {
  [RN_MODAL_PRESENTATION.FULL_SCREEN]: "fullScreen",
  [RN_MODAL_PRESENTATION.PAGE_SHEET]: "pageSheet",
  [RN_MODAL_PRESENTATION.FORM_SHEET]: "formSheet",
  [RN_MODAL_PRESENTATION.OVER_FULL_SCREEN]: "overFullScreen",
};

export interface ModalProps {
  children: ReactNode;
  onRequestClose: () => void;
  presentation?: RNModalPresentation;
  visible: boolean;
}

export function Modal({
  visible,
  onRequestClose,
  presentation = RN_MODAL_PRESENTATION.OVER_FULL_SCREEN,
  children,
}: ModalProps) {
  const transparent = presentation === RN_MODAL_PRESENTATION.OVER_FULL_SCREEN;

  return (
    <RNModal
      animationType="slide"
      onRequestClose={onRequestClose}
      presentationStyle={MODAL_PRESENTATION_STYLE[presentation]}
      transparent={transparent}
      visible={visible}
    >
      {transparent ? (
        <View style={styles.overlay}>
          <Pressable onPress={onRequestClose} style={StyleSheet.absoluteFill} />
          <View style={[styles.content, styles.contentTransparent]}>
            {children}
          </View>
        </View>
      ) : (
        <View style={styles.sheetContainer}>
          <View style={styles.sheetContent}>{children}</View>
        </View>
      )}
    </RNModal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    alignItems: "center",
    backgroundColor: colors.blackAlpha40,
    flex: 1,
    justifyContent: "center",
    padding: spacing.s8,
    zIndex: zIndex.dialog,
  },
  content: {
    backgroundColor: colors.white,
    borderRadius: radius.r5,
    maxWidth: 640,
    padding: spacing.s8,
    width: "100%",
  } as ViewStyle,
  contentTransparent: {
    backgroundColor: colors.whiteAlpha80,
  },
  sheetContainer: {
    backgroundColor: colors.white,
    flex: 1,
  },
  sheetContent: {
    flex: 1,
    padding: spacing.s8,
  },
});
