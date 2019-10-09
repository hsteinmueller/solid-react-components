import React, { useState, useCallback, useEffect, memo, Fragment } from 'react';
import { FormModelConfig } from '@context';
// eslint-disable-next-line import/no-extraneous-dependencies
import { solidResponse, SolidError } from '@utils';
import { FormActions, formUi } from 'solid-forms';
import Form from './children/Form';
import Viewer from './children/Viewer';

type Props = {
  modelPath: String,
  podPath: String,
  title: String,
  autoSave: boolean,
  onInit: () => void,
  onLoaded: () => void,
  onError: () => void,
  onSuccess: () => void,
  onSave: () => void,
  onAddNewField: () => void,
  onDelete: () => void,
  settings: {
    theme: object,
    languageTheme: object,
    config: object
  }
};

const FormModel = memo(
  ({
    modelPath,
    podPath,
    autoSave,
    settings = {},
    title,
    viewer,
    onInit,
    onLoaded,
    onError,
    onCancel,
    onSuccess,
    onAddNewField,
    onDelete
  }: Props) => {
    const [formModel, setFormModel] = useState({});
    const [formObject, setFormObject] = useState({});
    const formActions = new FormActions(formModel, formObject);
    const { languageTheme } = settings;

    const init = useCallback(async () => {
      try {
        if (onInit) onInit();
        const model = await formUi.convertFormModel(modelPath, podPath);

        setFormModel(model);
        if (onLoaded) onLoaded();
        onSuccess(solidResponse(200, 'Init Render Success', { type: 'init' }));
      } catch (error) {
        onError(new SolidError(error, 'Error on render', 500));
      }
    });

    const addNewField = useCallback(id => {
      try {
        const updatedFormModelObject = formActions.addNewField(id);
        setFormModel(updatedFormModelObject);
        onAddNewField(solidResponse(200, 'New field successfully added'));
      } catch (error) {
        onError(new SolidError(error, 'Error adding new field', 500));
      }
    });

    const deleteField = useCallback(async id => {
      try {
        const updatedFormModelObject = await formActions.deleteField(id);
        setFormModel(updatedFormModelObject);
        onDelete(solidResponse(200, 'Field successfully deleted'));
      } catch (error) {
        onError(new SolidError(error, 'Error deleting field', 500));
      }
    });

    const modifyFormObject = useCallback((id, obj) => {
      const formObject = formActions.retrieveNewFormObject(id, obj);
      setFormObject(formObject);
    });

    const onCancelOrReset = useCallback(() => {
      if (onCancel) onCancel(formModel, formObject);
      else setFormObject({});
    });

    const onSave = useCallback(async e => {
      if (e) {
        e.preventDefault();
      }
      try {
        const updatedFormModel = await formActions.saveData();
        setFormModel(updatedFormModel);
        onSave();
      } catch (error) {
        onError(new SolidError(error, 'Error saving form', 500));
      }
    });

    useEffect(() => {
      init();
    }, []);

    return !viewer ? (
      <FormModelConfig.Provider value={settings}>
        <form onSubmit={onSave}>
          {title && <h1>Form Model</h1>}
          <Form
            {...{
              formModel,
              formObject,
              modifyFormObject,
              deleteField,
              addNewField,
              onSave,
              autoSave,
              settings
            }}
          />
          {!autoSave && (
            <Fragment>
              <button type="submit">{(languageTheme && languageTheme.save) || 'Save'}</button>
              <button type="button" onClick={onCancelOrReset}>
                {(languageTheme && languageTheme.cancel) || 'Cancel'}
              </button>
            </Fragment>
          )}
        </form>
      </FormModelConfig.Provider>
    ) : (
      <FormModelConfig.Provider value={settings}>
        <Viewer {...{ formModel }} />
      </FormModelConfig.Provider>
    );
  }
);

export default FormModel;
