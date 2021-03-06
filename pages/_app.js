import { StateProvider } from "@state/index";
import { globalStyles } from '../shared/styles'
import styled from '@emotion/styled'

import '../styles/fonts.css'

const AppWrapper = styled.div`
  display: flex;
  flex-flow: column;
  align-items: flex-start;
  overflow-x: hidden;
  min-height: 100vh;
`

const BodyWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  margin-top: 100px;
  align-items: center;
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  z-index: 1;
  > * {
    max-width: 1200px;
  }

  @media screen and (min-width: 680px) {
    padding-top: 2rem;
    margin-top: 140px;
  }
`

const App = ({ Component, pageProps }) => (
  <>
    <AppWrapper>
      <BodyWrapper>
        <StateProvider>
            <Component {...pageProps} />
        </StateProvider>
      </BodyWrapper>
    </AppWrapper>
    { globalStyles }
  </>
);

export default App
