import React from "react";
import { shexFormLabel } from "@utils";
import { ShexConfig } from "@context";

export const AddButton = ({
  expression,
  defaultExpression,
  allowNewFields,
  text = "+ Add new"
}) => {
  return (allowNewFields && (
    <ShexConfig.Consumer>
      {({
        theme,
        languageTheme: { language, addButtonText },
        config: { addNewShexField }
      }) => (
        <button
          onClick={() => addNewShexField(defaultExpression, expression)}
          type="button"
          className={theme && theme.addButtonStyle}
        >
          {addButtonText || text} {shexFormLabel(defaultExpression, language)}
        </button>
      )}
    </ShexConfig.Consumer>
  ): null);
};
