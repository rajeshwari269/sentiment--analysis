import React from 'react';
import styled from 'styled-components';

const Button = ({ setShowDeleteModal }) => {
  return (
    <StyledWrapper>
      <div className="del">
        <button onClick={() => setShowDeleteModal(true)}>
          Permanently Delete My Account
        </button>
      </div>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  .del {
    position: relative;
    top: 0;
    left: 0;
    width: 260px;
    height: 50px;
    margin: 0;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .del button {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    background: none;
    box-shadow: 4px 4px 6px 0 rgba(255,255,255,.5),
                -4px -4px 6px 0 rgba(116, 125, 136, .5), 
                inset -4px -4px 6px 0 rgba(255,255,255,.2),
                inset 4px 4px 6px 0 rgba(0, 0, 0, .4);
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    border-top: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 30px;
    letter-spacing: 1px;
    color: #ff0000;
    font-weight: bold;
    cursor: pointer;
    z-index: 1;
    transition: 0.6s;
  }

  .del button:hover {
    letter-spacing: 2px;
    color: #fff;
    background: #ff0000;
  }
`;

export default Button;

