import React from "react";
import { StyleSheet, ScrollView } from "react-native";

/* =============================================================================
<Content />
============================================================================= */
const Content = ({
  center,
  children,
  containerStyle,
  horizontalPadding,
  contentContainerStyle,
  keyboardAvoidingViewProps,
  ...props
}) => {
  return (
    <ScrollView
      style={[
        styles.container,
        containerStyle,
        horizontalPadding && { paddingHorizontal: horizontalPadding },
      ]}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={[
        styles.contentContainer,
        center && styles.center,
        contentContainerStyle,
      ]}
      {...props}
    >
      {children}
    </ScrollView>
  );
};

Content.defaultProps = {
  horizontalPadding: 18,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  contentContainer: {
    flexGrow: 1,
    paddingBottom: 20,
    backgroundColor: "#fff",
  },
  horizontalPadding: {
    paddingHorizontal: 20,
  },
  center: {
    alignItems: "center",
    justifyContent: "center",
  },
});

/* Export
============================================================================= */
export default Content;
