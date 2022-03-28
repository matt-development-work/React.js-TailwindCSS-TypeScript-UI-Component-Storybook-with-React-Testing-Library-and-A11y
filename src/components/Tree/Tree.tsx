import React, {
  createContext,
  createRef,
  Dispatch,
  FC,
  forwardRef,
  HTMLAttributes,
  KeyboardEvent,
  MouseEvent,
  ReactNode,
  RefObject,
  SetStateAction,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleRight } from '@fortawesome/free-solid-svg-icons';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import './tree.css';

type ContextProps = {
  confirmFocus: (node: TreeNode, canFocus?: boolean) => void;
  data: TreeNode;
  getNodeAtSpecifiedId: (node: TreeNode, id: number) => TreeNode;
  handleKeyDown: (e: KeyboardEvent<HTMLDivElement>) => void;
  handleSetOpenNodeIds: (id: number, open: boolean) => void;
  mouseEntered: boolean;
  openNodeIds: number[];
  rootListElement: HTMLUListElement;
  focusedNode: TreeNode;
  setData: Dispatch<SetStateAction<TreeNode>>;
  setMouseEntered: Dispatch<SetStateAction<boolean>>;
  setRootListElement: Dispatch<SetStateAction<HTMLUListElement>>;
  setFocusedNode: Dispatch<SetStateAction<TreeNode>>;
};

const NodeListContext = createContext<ContextProps>({} as ContextProps);

const NodeListContextWrapper: FC<{
  children: ReactNode;
}> = ({ children }) => {
  const [data, setData] = useState<TreeNode>({} as TreeNode);
  const [mouseEntered, setMouseEntered] = useState<boolean>(false);
  const [openNodeIds, setOpenNodeIds] = useState<number[]>([]);
  const [rootListElement, setRootListElement] = useState<HTMLUListElement>(
    null as unknown as HTMLUListElement
  );
  const [focusedNode, setFocusedNode] = useState<TreeNode>({} as TreeNode);

  /**
   * Updates the openNodeIds array to correspond with the indices of the currently-opened node elements when the open state of a node with children is changed.
   * @param {number} id - Id of the node being toggled.
   * @param {boolean} open - New open state of the toggled node.
   * @returns {void}
   */
  const handleSetOpenNodeIds = useCallback(
    (id: number, open: boolean): void => {
      const openNodeIdsCopy = [...openNodeIds];
      switch (open) {
        case true:
          openNodeIdsCopy.splice(openNodeIdsCopy.indexOf(id), 1);
          break;
        case false:
          openNodeIdsCopy.push(id);
          break;
      }
      setOpenNodeIds(openNodeIdsCopy);
    },
    [openNodeIds]
  );

  /**
   * Traverses a tree to find the node with a specified ID.
   * @param {TreeNode} node - Root-level data.
   * @param {number} id - Number to be matched.
   * @returns {TreeNode} Node at specified ID, matching the structure of the root node provided.
   */
  const getNodeAtSpecifiedId = useCallback(
    (node: TreeNode, id: number): TreeNode => {
      let result = {} as TreeNode;
      if (node.id === id) {
        return node;
      } else if (!!node.children) {
        for (
          let i = 0;
          !Object.keys(result).length && i < node.children.length;
          i++
        ) {
          result = getNodeAtSpecifiedId(node.children[i], id);
        }
        return result;
      }
      return result;
    },
    []
  );

  /**
   * Handles node element focusing.
   * @param {TreeNode} node - Node to be selected.
   * @param {boolean} canToggle - Specifies if the open state of the new selected node changes upon being focused.
   * @returns {void}
   */
  const confirmFocus = useCallback(
    (node: TreeNode = {} as TreeNode, canToggle = true): void => {
      const { id } = node;
      setFocusedNode(node);
      canToggle &&
        'children' in node &&
        handleSetOpenNodeIds(id, openNodeIds.includes(id));
    },
    [openNodeIds]
  );

  type NodeElementFocusingUtilities = {
    activeElement: Element;
    focusableNodeElements: NodeListOf<Element> | [];
    focusableNodeElementsIds: number[];
  };

  /**
   * @returns {NodeElementFocusingUtilities} HTML-derived variables used in the node element focusing methodology.
   */
  const getNodeElementFocusingUtilities =
    useCallback((): NodeElementFocusingUtilities => {
      const focusableNodeElements: NodeListOf<Element> | [] =
        rootListElement?.querySelectorAll('li') ?? [];
      return {
        activeElement: document.activeElement as Element,
        focusableNodeElements: focusableNodeElements,
        focusableNodeElementsIds: Array.from(focusableNodeElements).map((n) =>
          parseInt(n.id)
        ),
      };
    }, [document, rootListElement]);

  /**
   * Handles NodeElement focusing and navigation.
   * @param {KeyboardEvent} e
   * @returns {void}
   */
  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLDivElement>): void => {
      const { key } = e;
      if (['ArrowLeft', 'ArrowRight'].includes(key)) {
        const { id } = focusedNode;
        const open: boolean = openNodeIds.includes(id);
        switch (key) {
          /* LeftArrow:
            When focus is on an open node, closes the node.
            When focus is on a child node, moves focus to its parent node.
          */
          case 'ArrowLeft':
            if (open) {
              confirmFocus(focusedNode);
              return;
            }
            const {
              activeElement,
              focusableNodeElements,
              focusableNodeElementsIds,
            } = getNodeElementFocusingUtilities();
            for (
              let i = focusableNodeElementsIds.indexOf(id) - 1;
              i > -1;
              i--
            ) {
              if (
                focusableNodeElements[i]?.contains(
                  activeElement as HTMLLIElement
                )
              ) {
                const parentID: number = parseInt(focusableNodeElements[i].id);
                const parentNode: TreeNode = getNodeAtSpecifiedId(
                  data,
                  parentID
                );
                confirmFocus(parentNode, false);
                return;
              }
            }
            break;
          /* RightArrow:
            When focus is on a closed node, opens the node; focus does not move.
            When focus is on a open node, moves focus to the first child node.
          */
          case 'ArrowRight':
            if ('children' in focusedNode) {
              if (!open) {
                confirmFocus(focusedNode);
              } else {
                const { focusableNodeElementsIds } =
                  getNodeElementFocusingUtilities();
                let selectedIndex: number = focusableNodeElementsIds.indexOf(
                  focusedNode.id
                );
                const nextFocusableNode: TreeNode = getNodeAtSpecifiedId(
                  focusedNode,
                  focusableNodeElementsIds[selectedIndex + 1]
                );
                confirmFocus(nextFocusableNode, false);
              }
            }
            break;
        }
        return;
      } else if (['Enter'].includes(key)) {
        const navigatedNode: TreeNode = getNodeAtSpecifiedId(
          data,
          focusedNode.id
        );
        confirmFocus(navigatedNode);
        return;
      } else if (['ArrowUp', 'ArrowDown', 'Tab'].includes(key)) {
        const { focusableNodeElementsIds } = getNodeElementFocusingUtilities();
        let selectedIndex: number =
          focusableNodeElementsIds.indexOf(focusedNode.id) ?? 1;
        switch (key) {
          case 'ArrowUp':
            selectedIndex -= 1;
            break;
          case 'ArrowDown':
            selectedIndex += 1;
            break;
          case 'Tab':
            selectedIndex = e.shiftKey ? selectedIndex - 1 : selectedIndex + 1;
            break;
        }
        const nextFocusableNodeId: number =
          focusableNodeElementsIds[selectedIndex];
        /* Returns before focusing if navigating direction has no subsequent navigable elements.
        (i.e. if attempting to navigate upwards from a currently-selected first element,
        or if attempting to navigate downwards from a currently-selected last element.) */
        if (!nextFocusableNodeId && key !== 'Tab') return;
        const nextFocusableNode: TreeNode = getNodeAtSpecifiedId(
          data,
          nextFocusableNodeId
        );
        confirmFocus(nextFocusableNode, false);
        return;
      }
      return;
    },
    [children, document, open, openNodeIds, focusedNode, data]
  );

  return (
    <NodeListContext.Provider
      value={{
        confirmFocus: confirmFocus,
        data: data,
        getNodeAtSpecifiedId: getNodeAtSpecifiedId,
        handleKeyDown: handleKeyDown,
        handleSetOpenNodeIds: handleSetOpenNodeIds,
        mouseEntered: mouseEntered,
        openNodeIds: openNodeIds,
        rootListElement: rootListElement,
        focusedNode: focusedNode,
        setData: setData,
        setMouseEntered: setMouseEntered,
        setRootListElement: setRootListElement,
        setFocusedNode: setFocusedNode,
      }}
    >
      {children}
    </NodeListContext.Provider>
  );
};

const useNodeListContext = () => useContext(NodeListContext);

export type TreeNode = {
  children?: TreeNode[];
  icon?: ReactNode;
  id: number;
  value: string;
};

interface NodeElementProps extends HTMLAttributes<HTMLLIElement> {
  node: TreeNode;
}

const NodeElement = forwardRef<HTMLLIElement, NodeElementProps>(
  ({ node }, ref) => {
    const { confirmFocus, focusedNode, mouseEntered, openNodeIds } =
      useNodeListContext();
    const { id } = node;
    const children = useMemo<boolean>(() => 'children' in node, [node]);
    const icon = useMemo<boolean>(() => 'icon' in node, [node]);
    const open = useMemo<boolean>(
      () => openNodeIds.includes(id),
      [openNodeIds, node]
    );
    const focused = useMemo<boolean>(
      () => id === focusedNode.id,
      [id, focusedNode]
    );
    const currentDirectory = useMemo<boolean>(
      () =>
        /*
        Returns true if either:
          a. selectedNode has children and is equal to the node prop.
          b. selectedNode does not have children and is a child of the node prop.
      */
        (!!focusedNode?.children && node === focusedNode) ||
        (!focusedNode?.children && node.children?.includes(focusedNode)) ||
        false,
      [node, focusedNode]
    );
    return (
      <li
        aria-expanded={open}
        className={
          'hover:bg-emerald-600 hover:bg-opacity-20 transition ease-in-out duration-150'
        }
        id={`${id}`}
        onClick={(
          e: MouseEvent<HTMLLIElement, globalThis.MouseEvent>
        ): void => {
          e.stopPropagation();
        }}
        ref={ref}
        role="treeitem"
        tabIndex={focused ? 0 : -1}
      >
        <span
          className={`flex px-2 focus:outline-none z-20 border border-opacity-0 ${
            !focused
              ? ` hover:bg-emerald-600 hover:bg-opacity-40 hover:border-amber-400 hover:border-opacity-100`
              : ` bg-emerald-600 bg-opacity-50 border border-opacity-100 border-lime-400`
          }`}
          onClick={(): void => {
            confirmFocus(node);
          }}
        >
          {children && (
            /*
          TODO:
            1. Move all all non-component-specific styling parameters to stories file and/or theme.
           */
            <i
              className={
                open
                  ? 'transform rotate-90 transition-transform ease-in-out duration-100'
                  : ''
              }
            >
              {
                <FontAwesomeIcon
                  className={
                    'text-green-400 hover:text-green-500 transition ease-in-out duration-200'
                  }
                  icon={faAngleRight as IconProp}
                  size="sm"
                />
              }
            </i>
          )}
          <span
            className={`text-white select-none flex transition ease-in-out duration-75 px-1 ml-${
              children ? '1' : '3'
            }${icon ? ' gap-x-2' : ''}`}
          >
            <i className="flex items-center">{node.icon}</i>
            <span>{node.value}</span>
          </span>
        </span>
        {children && open && (
          <NodeList
            /* Displays left vertical rulers as applicable. */
            className={`ml-4 border-l transition ease-in-out duration-150${
              currentDirectory
                ? ' border-gray-200'
                : mouseEntered
                ? ' border-gray-300 border-opacity-30'
                : ' border-opacity-0'
            }`}
            data={node}
            role="group"
          />
        )}
      </li>
    );
  }
);

interface NodeListProps extends HTMLAttributes<HTMLUListElement> {
  className?: string;
  data: TreeNode;
}

const NodeList = forwardRef<HTMLUListElement, NodeListProps>(
  ({ className, data, role = 'tree' }, ref) => {
    const { id, children } = data;
    className = useMemo<string>(
      () => (className ? ` ${className}` : ''),
      [className]
    );
    return (
      <ul
        className={`flex flex-col${className}`}
        id={`node-list-${id}`}
        ref={ref}
        role={role}
      >
        {children?.map((n: TreeNode) => (
          <NodeElement key={n.value} node={n} />
        ))}
      </ul>
    );
  }
);

export type TreeProps = {
  className?: string;
  data: TreeNode;
};

const NodeListContainer: FC<TreeProps> = (props) => {
  const {
    focusedNode,
    getNodeAtSpecifiedId,
    handleKeyDown,
    setData,
    setFocusedNode,
    setMouseEntered,
    setRootListElement,
  } = useNodeListContext();
  const { data } = props;
  useEffect(() => {
    setData(data);
  }, [data]);
  const containerRef: RefObject<HTMLDivElement> = createRef<HTMLDivElement>();
  const setInitialTabIndex = (): void => {
    const firstFocusableElement: HTMLLIElement =
      containerRef.current?.querySelector('li') as HTMLLIElement;
    firstFocusableElement.setAttribute('tabindex', '0');
  };
  useEffect(() => {
    if (containerRef.current) {
      setRootListElement(
        containerRef.current?.querySelector('#node-list-0') as HTMLUListElement
      );
      setInitialTabIndex();
    }
  }, [containerRef.current]);
  useEffect(() => {
    const nextFocusableElement: HTMLLIElement =
      containerRef.current?.querySelector(
        `[id='${focusedNode.id}']`
      ) as HTMLLIElement;
    nextFocusableElement?.focus();
  }, [focusedNode]);
  return (
    <div
      className="cursor-pointer"
      onBlur={(): void => {
        !focusedNode.id && setInitialTabIndex();
      }}
      onFocus={(): void => {
        !focusedNode.id && setFocusedNode(getNodeAtSpecifiedId(data, 1));
      }}
      onKeyDown={handleKeyDown}
      onMouseEnter={(): void => setMouseEntered(true)}
      onMouseLeave={(): void => setMouseEntered(false)}
      ref={containerRef}
    >
      <NodeList {...props} />
    </div>
  );
};

export const Tree: FC<TreeProps> = (props) => {
  return (
    <NodeListContextWrapper>
      <NodeListContainer {...props} />
    </NodeListContextWrapper>
  );
};
