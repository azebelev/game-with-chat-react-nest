import styled from '@emotion/styled';

export const BlinkingWrapper = styled.div`
  animation: blinkAnimation 1s infinite alternate;

  @keyframes blinkAnimation {
    from {
      opacity: 1;
    }
    to {
      opacity: 0.5;
    }
  }
`;
