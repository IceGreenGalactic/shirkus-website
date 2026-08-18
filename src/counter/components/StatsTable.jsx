import React from "react";
import {
  Table,
  Th,
  Td,
  ChildRow,
  ChildCellName,
  ChildCell,
  ParentRow,
  Arrow,
} from "../../pages/info/Admin.styled";

import { FaPaw } from "react-icons/fa";
import usePrettyNames from "../../hooks/usePrettyNames";
import { pageNameMap, getPageLabel } from "../utils/labelUtils";

const nf = new Intl.NumberFormat("no-NO");

const expandableSlugs = new Set(["/dogs", "/litters", "/gallery"]);

export default function StatsTable({
  totalRow,
  rows,
  childrenByGroup,
  expanded,
  setExpanded,
}) {
  const pretty = usePrettyNames(childrenByGroup);

  return (
    <Table>
      <thead>
        <tr>
          <Th>Side</Th>
          <Th>I dag</Th>
          <Th>Unike i dag</Th>
          <Th>Besøk totalt</Th>
          <Th>Unike totalt</Th>
        </tr>
      </thead>

      <tbody>
        <ParentRow>
          <Td>
            <strong>Totalt</strong>
          </Td>

          <Td>
            <strong>{nf.format(Number(totalRow?.sessionsToday || 0))}</strong>
          </Td>

          <Td>
            <strong>{nf.format(Number(totalRow?.uniquesToday || 0))}</strong>
          </Td>

          <Td>
            <strong>{nf.format(Number(totalRow?.sessionsTotal || 0))}</strong>
          </Td>

          <Td>
            <strong>{nf.format(Number(totalRow?.uniquesTotal || 0))}</strong>
          </Td>
        </ParentRow>

        {rows.map((row) => (
          <React.Fragment key={row.page}>
            <ParentRow className={expanded[row.page] ? "open" : ""}>
              <Td>
                <RowLabel
                  row={row}
                  childrenByGroup={childrenByGroup}
                  expanded={expanded}
                  setExpanded={setExpanded}
                />
              </Td>

              <Td>{nf.format(Number(row.sessionsToday || 0))}</Td>

              <Td>{nf.format(Number(row.uniquesToday || 0))}</Td>

              <Td>{nf.format(Number(row.sessionsTotal || 0))}</Td>

              <Td>{nf.format(Number(row.uniquesTotal || 0))}</Td>
            </ParentRow>

            {expandableSlugs.has(row.page) && expanded[row.page] && (
              <ChildrenRows
                slug={row.page}
                childrenByGroup={childrenByGroup}
                pretty={pretty}
              />
            )}
          </React.Fragment>
        ))}
      </tbody>
    </Table>
  );
}

function RowLabel({ row, childrenByGroup, expanded, setExpanded }) {
  const slug = row.page;

  const items = childrenByGroup[slug] || [];

  const canExpand = expandableSlugs.has(slug) && items.length > 0;

  const isOpen = Boolean(expanded[slug]);

  const label = pageNameMap[slug] || getPageLabel(slug);

  if (!canExpand) {
    return label;
  }

  return (
    <span
      onClick={() =>
        setExpanded((current) => ({
          ...current,
          [slug]: !current[slug],
        }))
      }
      style={{
        cursor: "pointer",
        userSelect: "none",
      }}
    >
      <Arrow className={isOpen ? "open" : undefined}>
        <FaPaw />
      </Arrow>

      {label}
    </span>
  );
}

function ChildrenRows({ slug, childrenByGroup, pretty }) {
  const items = childrenByGroup[slug] || [];

  if (items.length === 0) {
    return null;
  }

  return (
    <>
      {items.map((row) => (
        <ChildRow key={row.page}>
          <ChildCellName>
            {pretty[row.page] || getPageLabel(row.page, pretty)}
          </ChildCellName>

          <ChildCell>{nf.format(Number(row.sessionsToday || 0))}</ChildCell>

          <ChildCell>{nf.format(Number(row.uniquesToday || 0))}</ChildCell>

          <ChildCell>{nf.format(Number(row.sessionsTotal || 0))}</ChildCell>

          <ChildCell>{nf.format(Number(row.uniquesTotal || 0))}</ChildCell>
        </ChildRow>
      ))}
    </>
  );
}
