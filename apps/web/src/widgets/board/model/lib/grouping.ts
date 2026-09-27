import type { ElementType } from "../types";

export type GroupedElementsBucket = {
  groupId: string | null;
  elements: ElementType[];
};

export type GroupingSelectionState = {
  selectedCount: number;
  groupedSelectedCount: number;
  ungroupedSelectedCount: number;
  selectedGroupIds: Set<string>;
  hasGroupedSelection: boolean;
  canGroup: boolean;
  canUngroup: boolean;
};

export const expandIdsWithGroups = (
  elements: Map<string, ElementType>,
  ids: Set<string>,
): Set<string> => {
  if (ids.size === 0) return new Set();

  const expanded = new Set(ids);
  const groupIds = new Set<string>();

  ids.forEach((id) => {
    const element = elements.get(id);
    if (element?.groupId) groupIds.add(element.groupId);
  });

  if (groupIds.size === 0) return expanded;

  elements.forEach((element) => {
    if (element.groupId && groupIds.has(element.groupId)) {
      expanded.add(element.id);
    }
  });

  return expanded;
};

export const getGroupingSelectionState = (
  elements: Map<string, ElementType>,
  selectedIds: Set<string>,
): GroupingSelectionState => {
  const selectedGroupIds = new Set<string>();
  let groupedSelectedCount = 0;
  let ungroupedSelectedCount = 0;

  selectedIds.forEach((id) => {
    const element = elements.get(id);
    if (!element?.groupId) {
      ungroupedSelectedCount += 1;
      return;
    }

    groupedSelectedCount += 1;
    selectedGroupIds.add(element.groupId);
  });

  const selectedCount = selectedIds.size;
  const selectedBucketCount = selectedGroupIds.size + ungroupedSelectedCount;

  return {
    selectedCount,
    groupedSelectedCount,
    ungroupedSelectedCount,
    selectedGroupIds,
    hasGroupedSelection: groupedSelectedCount > 0,
    canGroup: selectedCount > 1 && selectedBucketCount > 1,
    canUngroup: selectedGroupIds.size > 0,
  };
};

export const splitElementsByGroups = (
  elements: ElementType[],
): GroupedElementsBucket[] => {
  const buckets: GroupedElementsBucket[] = [];
  const bucketByKey = new Map<string, GroupedElementsBucket>();

  elements.forEach((element) => {
    const bucketKey = element.groupId ?? element.id;
    const existingBucket = bucketByKey.get(bucketKey);

    if (existingBucket) {
      existingBucket.elements.push(element);
      return;
    }

    const bucket: GroupedElementsBucket = {
      groupId: element.groupId ?? null,
      elements: [element],
    };

    bucketByKey.set(bucketKey, bucket);
    buckets.push(bucket);
  });

  return buckets;
};
