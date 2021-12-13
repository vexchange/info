import React, { useEffect, useState, useMemo } from "react";
import { useMedia } from "react-use";
import { Flex } from "rebass";

import DoubleTokenLogo from "../DoubleLogo";

import FormattedName from "../FormattedName";
import { formatCurrency, formattedPercent } from "../../utils";

import {
  ClickableText,
  DataText,
  Table,
  Wrapper,
} from './styled'

const SORT_FIELD = {
  LIQ: "totalReserveUsd",
  VOL: "totalVolumeUsd",
  PRICE: "priceInVet",
  APR: "annualizedFeeApr",
};

const PairTable = ({ pairs, itemMax = 20 }) => {
  const [page, setPage] = useState(1);

  // sorting
  const [sortDirection, setSortDirection] = useState(true);
  const [sortedColumn, setSortedColumn] = useState(SORT_FIELD.VOL);

  const ifBelow640 = useMedia("(max-width: 640px)");
  const ifBelow600 = useMedia("(max-width: 600px)");

  useEffect(() => {
    setPage(1);
  }, [pairs]);

  const filteredList = useMemo(() => {
    return (
      pairs &&
      pairs
        .sort((a, b) => {
          if (
            sortedColumn === SORT_FIELD.SYMBOL ||
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
  }, [pairs, itemMax, page, sortDirection, sortedColumn]);

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
                  {"Pair"}{" "}
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
                area="liq"
                onClick={() => {
                  setSortedColumn(SORT_FIELD.LIQ);
                  setSortDirection(
                    sortedColumn !== SORT_FIELD.LIQ ? true : !sortDirection
                  );
                }}
              >
                Liquidity{" "}
                {sortedColumn === SORT_FIELD.LIQ
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
                  setSortedColumn(SORT_FIELD.VOL);
                  setSortDirection(
                    sortedColumn !== SORT_FIELD.VOL ? true : !sortDirection
                  );
                }}
              >
                Volume (24hrs)
                {sortedColumn === SORT_FIELD.VOL
                  ? !sortDirection
                    ? "↑"
                    : "↓"
                  : ""}
              </ClickableText>
            </th>
            {/* <th>
              <ClickableText
                area="price"
                onClick={(e) => {
                  setSortedColumn(SORT_FIELD.PRICE);
                  setSortDirection(
                    sortedColumn !== SORT_FIELD.PRICE ? true : !sortDirection
                  );
                }}
              >
                Price{" "}
                {sortedColumn === SORT_FIELD.PRICE
                  ? !sortDirection
                    ? "↑"
                    : "↓"
                  : ""}
              </ClickableText>
            </th> */}
            <th>
              <ClickableText
                area="apr"
                onClick={() => {
                  setSortedColumn(SORT_FIELD.APR);
                  setSortDirection(
                    sortedColumn !== SORT_FIELD.APR ? true : !sortDirection
                  );
                }}
              >
                APR
                {sortedColumn === SORT_FIELD.APR
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
                      {!ifBelow640 && (
                        <>
                          <div style={{ marginRight: "1rem", width: "10px" }}>
                            {index + 1}
                          </div>
                          {item?.token0 && item?.token1 && (
                            <DoubleTokenLogo
                              a0={item?.token0?.contractAddress || ""}
                              a1={item?.token1?.contractAddress || ""}
                              size={26}
                              margin={true}
                            />
                          )}
                        </>
                      )}
                      <FormattedName
                        margin="15px"
                        text={`${item.token0 ? item.token0.symbol : "?"}/${
                          item.token1 ? item.token1.symbol : "?"
                        }`}
                        maxCharacters={ifBelow600 ? 8 : 16}
                        adjustSize={true}
                        link={true}
                      />
                    </DataText>
                  </td>
                  <td data-label="Liquidity:">
                    <DataText area="liq" justifyContent="flex-end">
                      {formatCurrency(item.totalReserveUsd)}
                    </DataText>
                  </td>
                  <td data-label="Volume:">
                    <DataText area="vol" justifyContent="flex-end">
                      {formatCurrency(item.totalVolumeUsd)}
                    </DataText>
                  </td>
                  {/* <td data-label="Price:">
                    <DataText
                      area="price"
                      color="text"
                      fontWeight="500"
                      justifyContent="flex-end"
                    >
                      {formatCurrency(item.price.base2quote * vetPrice)}
                    </DataText>
                  </td> */}
                  <td data-label="APR:">
                    <DataText area="apr" justifyContent="flex-end">
                      {formattedPercent(item.annualizedFeeApr)}
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

export default PairTable;
