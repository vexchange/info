import React, { useEffect, useState, useMemo } from "react";
import { useMedia } from "react-use";
import { Flex } from "rebass";

import TokenLogo from "../TokenLogo";

import FormattedName from "../FormattedName";
import { formatCurrency } from "../../utils";

import {
  ClickableText,
  DataText,
  Table,
  Wrapper,
} from './styled'

const SORT_FIELD = {
  NAME: "name",
  SYM: "symbol",
  PRICE: "usdPrice",
};

const TokenTable = ({ tokens, itemMax = 20 }) => {
  const [page, setPage] = useState(1);

  // sorting
  const [sortDirection, setSortDirection] = useState(false);
  const [sortedColumn, setSortedColumn] = useState(SORT_FIELD.NAME);

  const ifBelow640 = useMedia("(max-width: 640px)");
  const ifBelow600 = useMedia("(max-width: 600px)");

  useEffect(() => {
    setPage(1);
  }, [tokens]);

  const filteredList = useMemo(() => {
    return (
      tokens &&
      tokens
        .sort((a, b) => {
          if (
            sortedColumn === SORT_FIELD.SYM ||
            sortedColumn === SORT_FIELD.NAME
          ) {
            return a[sortedColumn] > b[sortedColumn]
              ? (sortDirection ? -1 : 1) * 1
              : (sortDirection ? -1 : 1) * -1;
          }
          return parseFloat(a[sortedColumn]) > parseFloat(b[sortedColumn])
            ? (sortDirection ? -1 : 1) * 1
            : (sortDirection ? -1 : 1) * -1;
        })
        .slice(itemMax * (page - 1), page * itemMax)
    );
  }, [tokens, itemMax, page, sortDirection, sortedColumn]);

  return (
    <Wrapper>
      <Table>
        <thead>
          <tr>
            <th>
              <Flex alignItems="center" justifyContent="flexStart">
                <ClickableText
                  color="text"
                  area="name"
                  fontWeight="500"
                  onClick={() => {
                    setSortedColumn(SORT_FIELD.NAME);
                    setSortDirection(
                      sortedColumn !== SORT_FIELD.NAME ? true : !sortDirection
                    );
                  }}
                >
                  Token{" "}
                  {sortedColumn === SORT_FIELD.NAME
                    ? !sortDirection
                      ? "↑"
                      : "↓"
                    : ""}
                </ClickableText>
              </Flex>
            </th>
            <th>
              <ClickableText
                area="sym"
                onClick={() => {
                  setSortedColumn(SORT_FIELD.SYM);
                  setSortDirection(
                    sortedColumn !== SORT_FIELD.SYM ? true : !sortDirection
                  );
                }}
              >
                Symbol{" "}
                {sortedColumn === SORT_FIELD.SYM
                  ? !sortDirection
                    ? "↑"
                    : "↓"
                  : ""}
              </ClickableText>
            </th>
            <th>
              <ClickableText
                area="vol"
                onClick={() => {
                  setSortedColumn(SORT_FIELD.PRICE);
                  setSortDirection(
                    sortedColumn !== SORT_FIELD.PRICE ? true : !sortDirection
                  );
                }}
              >
                Price
                {sortedColumn === SORT_FIELD.PRICE
                  ? !sortDirection
                    ? "↑"
                    : "↓"
                  : ""}
              </ClickableText>
            </th>
          </tr>
        </thead>
        <tbody>
          {filteredList &&
            filteredList.map((item, index) => {
              return (
                <tr key={index}>
                  <td data-label="Name:">
                    <DataText area="name" fontWeight="500">
                      {!ifBelow640 && item?.contractAddress ? (
                        <TokenLogo
                          address={item.contractAddress}
                          size={'26px'}
                          margin={true}
                        />
                      ) : null}
                      <FormattedName
                        margin="15px"
                        text={item.name}
                        maxCharacters={ifBelow600 ? 8 : 16}
                        adjustSize={true}
                        link={true}
                      />
                    </DataText>
                  </td>
                  <td data-label="Symbol:">
                    <DataText area="sym" justifyContent="flex-end">
                      {item.symbol}
                    </DataText>
                  </td>
                  <td data-label="Price:">
                    <DataText
                      area="price"
                      color="text"
                      fontWeight="500"
                      justifyContent="flex-end"
                    >
                      {formatCurrency(item.usdPrice)}
                    </DataText>
                  </td>
                </tr>
              );
            })}
        </tbody>
      </Table>
    </Wrapper>
  );
};

export default TokenTable;
