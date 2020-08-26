import React, { useState } from 'react';
import { HorizontalGroup, Icon, renderOrCallToRender, stylesFactory, useTheme } from '@grafana/ui';
import { GrafanaTheme } from '@grafana/data';
import { css } from 'emotion';
import { useUpdateEffect } from 'react-use';
import { Draggable } from 'react-beautiful-dnd';

interface QueryOperationRowProps {
  index: number;
  id: string;
  title?: ((props: { isOpen: boolean }) => React.ReactNode) | React.ReactNode;
  headerElement?: React.ReactNode;
  actions?:
    | ((props: { isOpen: boolean; openRow: () => void; closeRow: () => void }) => React.ReactNode)
    | React.ReactNode;
  onOpen?: () => void;
  onClose?: () => void;
  children: React.ReactNode;
  isOpen?: boolean;
  draggable?: boolean;
}

export const QueryOperationRow: React.FC<QueryOperationRowProps> = ({
  children,
  actions,
  title,
  headerElement,
  onClose,
  onOpen,
  isOpen,
  draggable,
  index,
  id,
}: QueryOperationRowProps) => {
  const [isContentVisible, setIsContentVisible] = useState(isOpen !== undefined ? isOpen : true);
  const theme = useTheme();
  const styles = getQueryOperationRowStyles(theme);

  useUpdateEffect(() => {
    if (isContentVisible) {
      if (onOpen) {
        onOpen();
      }
    } else {
      if (onClose) {
        onClose();
      }
    }
  }, [isContentVisible]);

  const titleElement = title && renderOrCallToRender(title, { isOpen: isContentVisible });
  const actionsElement =
    actions &&
    renderOrCallToRender(actions, {
      isOpen: isContentVisible,
      openRow: () => {
        setIsContentVisible(true);
      },
      closeRow: () => {
        setIsContentVisible(false);
      },
    });

  const rowContent = (
    <>
      <div className={styles.header}>
        <HorizontalGroup justify="space-between">
          <div
            className={styles.titleWrapper}
            onClick={() => {
              setIsContentVisible(!isContentVisible);
            }}
            aria-label="Query operation row title"
          >
            {draggable && <Icon name="draggabledots" size="lg" className={styles.dragIcon} />}
            <Icon name={isContentVisible ? 'angle-down' : 'angle-right'} className={styles.collapseIcon} />
            {title && <span className={styles.title}>{titleElement}</span>}
            {headerElement}
          </div>
          {actions && actionsElement}
        </HorizontalGroup>
      </div>
      {isContentVisible && <div className={styles.content}>{children}</div>}
    </>
  );
  return draggable ? (
    <Draggable draggableId={id} index={index}>
      {provided => {
        return (
          <div
            ref={provided.innerRef}
            className={styles.wrapper}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
          >
            {rowContent}
          </div>
        );
      }}
    </Draggable>
  ) : (
    <div className={styles.wrapper}>{rowContent}</div>
  );
};

const getQueryOperationRowStyles = stylesFactory((theme: GrafanaTheme) => {
  return {
    wrapper: css`
      margin-bottom: ${theme.spacing.md};
    `,
    header: css`
      padding: ${theme.spacing.xs} ${theme.spacing.sm};
      border-radius: ${theme.border.radius.sm};
      background: ${theme.colors.bg2};
      min-height: ${theme.spacing.formInputHeight}px;
      line-height: ${theme.spacing.sm}px;
      display: flex;
      align-items: center;
      justify-content: space-between;
    `,
    dragIcon: css`
      opacity: 0.4;
      cursor: hand;
    `,
    collapseIcon: css`
      color: ${theme.colors.textWeak};
      &:hover {
        color: ${theme.colors.text};
      }
    `,
    titleWrapper: css`
      display: flex;
      align-items: center;
      cursor: pointer;
    `,
    title: css`
      font-weight: ${theme.typography.weight.semibold};
      color: ${theme.colors.textBlue};
      margin-left: ${theme.spacing.sm};
    `,
    content: css`
      margin-top: ${theme.spacing.inlineFormMargin};
      margin-left: ${theme.spacing.lg};
    `,
  };
});

QueryOperationRow.displayName = 'QueryOperationRow';
