import React from "react";
import { css } from "@emotion/css";

import { RxLoop } from "react-icons/rx";
import IconButton from "./IconButton";
import { GlobalState, useGlobalStateContext } from "state/GlobalState";
import styled from "@emotion/styled";

const LoopingIndicator = styled.span`
  position: absolute;
  font-size: 0.5rem;
  font-weight: bold;
  padding: 0.15rem 0.25rem;
  background-color: var(--mi-primary-color);
  border-radius: 100%;
  color: white;
  top: 0.2rem;
  right: 0.2rem;
`;

export const LoopButton: React.FC = () => {
  const {
    state: { looping },
    dispatch,
  } = useGlobalStateContext();

  const onLoop = React.useCallback(() => {
    let nextLooping: GlobalState["looping"] = undefined;
    if (looping === undefined) {
      nextLooping = "loopTrack";
    } else if (looping === "loopTrack") {
      nextLooping = "loopQueue";
    }
    dispatch({ type: "setLooping", looping: nextLooping });
  }, [dispatch, looping]);

  return (
    <IconButton
      role={looping ? "primary" : undefined}
      onClick={onLoop}
      className={css`
        margin-left: 0.25rem;
        position: relative;
        ${looping ? "color: var(--mi-link-color) !important;" : ""}
      `}
    >
      <RxLoop />
      {looping === "loopTrack" && <LoopingIndicator>1</LoopingIndicator>}
    </IconButton>
  );
};

export default LoopButton;
