import styled from "@emotion/styled";
import { Flex, Text } from "rebass";

import Card from "../Card";

export const Wrapper = styled(Card)`
  margin-bottom: 200px;

  @media screen and (max-width: 640px) {
    background: none;
    padding: 0;
  }
`;

export const ClickableText = styled(Text)`
  text-align: end;
  &:hover {
    cursor: pointer;
    opacity: 0.6;
  }
  user-select: none;
  color: #fafafa !important;
  @media screen and (max-width: 640px) {
    font-size: 0.85rem;
  }
`;

export const DataText = styled(Flex)`
  align-items: center;
  text-align: center;
  color: #fafafa !important;
  & > * {
    font-size: 14px;
  }
  @media screen and (max-width: 600px) {
    font-size: 12px;
  }
`;

export const Table = styled.table`
  border-collapse: collapse;

  th {
    font-weight: normal;
  }

  td,
  th {
    border: none;
    padding: 15px;
  }

  @media screen and (max-width: 640px) {
    border: 0;

    thead {
      border: none;
      clip: rect(0 0 0 0);
      height: 1px;
      margin: -1px;
      overflow: hidden;
      padding: 0;
      position: absolute;
      width: 1px;
    }

    tr {
      border-radius: 8px;
      display: block;
      margin-bottom: 20px;
      padding-left: 1rem;
      padding-right: 1rem;
      background-color: rgb(25, 27, 31);
    }

    td {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding-left: 0;
      padding-right: 0;

      &:not(:last-of-type) {
        border-bottom: 1px solid rgb(64, 68, 79);
      }

      &::before {
        content: attr(data-label);
        float: left;
        font-weight: bold;
        margin-right: 8px;
      }
    }
  }
`;

