import React, { useEffect, useState, useCallback } from 'react';
import { useWebId } from '@solid/react';
import styled from 'styled-components';
import SolidImg from '../assets/solid_logo.png';
import { ProviderLogin, Uploader, ProfileUploader, useNotification, FormModel } from '../lib';
import { AccessControlList } from '@classes';
import HandleShexForm from './components';

const HeaderWrapper = styled.section`
  margin-top: 60px;
  text-align: center;
  width: 100%;
`;

const DemoWrapper = styled.div`
  max-width: 900px;
  margin: 0 auto;
`;

const Headline = styled.h1`
  color: #333;
  font-size: 36px;
  font-weight: 300;
`;

const ShexFormComponent = styled.div`
    border-top: 1px solid black;
    
    input {
      margin: 20px 0;
      padding: 10px;
      width: 100%
      box-sizing: border-box;
   }
`;

const NotificationSection = styled.div`
  button {
    &:disabled {
      cursor: not-allowed;
    }
  }

  input {
    margin: 20px 0;
    padding: 10px;
    width: 100%;
    box-sizing: border-box;
  }
`;

const Header = () => {
  return (
    <HeaderWrapper>
      <img src={SolidImg} alt="React logo" width="62" />
      <Headline>Solid React Components</Headline>
    </HeaderWrapper>
  );
};

const App = () => {
  const [userInbox, setUserInbox] = useState('');
  const webId = useWebId();
  const { fetchNotification, notification, createNotification, discoverInbox } = useNotification(
    webId
  );

  const onChange = useCallback((event: Event) => {
    const { target } = event;
    setUserInbox(target.value);
  });

  const init = async () => {
    const result = await discoverInbox(webId);

    fetchNotification([{ path: result, inboxName: 'Global App' }]);
  };

  const createAcl = async () => {
    if (webId) {
      const uri = new URL(webId);
      const documentURI = `${uri.origin}/public/container`;
      const { MODES } = AccessControlList;
      const permissions = [{ modes: [MODES.CONTROL], agents: [webId] }];
      const aclInstance = new AccessControlList(webId, documentURI);
      await aclInstance.createACL(permissions);
    }
  };

  useEffect(() => {
    if (webId) init();
  }, [notification.notify, webId]);

  return (
    <DemoWrapper>
      <Header />
      <button type="button" onClick={createAcl}>
        Create ACL
      </button>
      <p>{JSON.stringify(notification && notification.notifications)}</p>
      <ProviderLogin callbackUri={`${window.location.origin}/`} />
      <FormModel
        modelPath="https://jairocr.inrupt.net/public/form.ttl#form1"
        podPath="https://jcampos.inrupt.net/profile/card#me"
        autoSave
      />
      <Uploader
        {...{
          fileBase: 'Your POD folder here',
          limitFiles: 1,
          limitSize: 500000,
          accept: 'png,jpg,jpeg',
          onError: error => {
            // eslint-disable-next-line no-console
            console.log(error.statusText);
          },
          onComplete: (recentlyUploadedFiles, uploadedFiles) => {
            // eslint-disable-next-line no-console
            console.log(recentlyUploadedFiles, uploadedFiles);
          },
          render: props => <ProfileUploader {...{ ...props }} />
        }}
      />
      {webId && (
        <ShexFormComponent>
          <HandleShexForm {...{ webId }} />
        </ShexFormComponent>
      )}
      <NotificationSection>
        <h3>Create notification example using your inbox</h3>
        <input
          type="text"
          placeholder="Inbox Path"
          name="userInbox"
          onChange={onChange}
          value={userInbox}
        />
        <button
          type="button"
          disabled={!userInbox}
          onClick={() =>
            createNotification(
              {
                title: 'Notification Example',
                summary: 'This is a basic solid notification example.'
              },
              userInbox
            )
          }
        >
          Create notification
        </button>
      </NotificationSection>
    </DemoWrapper>
  );
};

export default App;
