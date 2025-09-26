import { GraphQLLong } from "graphql-scalars";
import GraphQLJSON from "graphql-type-json";
import {
  getActionById,
  getNodeById,
  getNodeParents,
  getResourceTemplateById,
  getResponseById,
  getTriggerById,
  loadData,
} from "./data/loaders.js";
import type { Action, NodeRecord, Response, Trigger } from "./types.js";

interface NodeArgs {
  nodeId: string;
}

const resolvers = {
  Long: GraphQLLong,
  JSON: GraphQLJSON,
  Query: {
    node: (_: unknown, { nodeId }: NodeArgs) => {
      if (!nodeId) {
        return null;
      }
      return getNodeById(nodeId);
    },
  },
  NodeObject: {
    triggerId: (node: NodeRecord) => node.trigger ?? node.triggerId ?? null,
    trigger: (node: NodeRecord) => {
      const triggerId = node.trigger ?? node.triggerId;
      return getTriggerById(triggerId ?? undefined);
    },
    responseIds: (node: NodeRecord) => node.responses ?? node.responseIds ?? [],
    responses: (node: NodeRecord) => {
      const ids = node.responses ?? node.responseIds ?? [];
      return ids
        .map((id) => getResponseById(id))
        .filter((response): response is Response => Boolean(response));
    },
    actionIds: (node: NodeRecord) => node.actions ?? node.actionIds ?? [],
    actions: (node: NodeRecord) => {
      const ids = node.actions ?? node.actionIds ?? [];
      return ids
        .map((id) => getActionById(id))
        .filter((action): action is Action => Boolean(action));
    },
    parentIds: (node: NodeRecord) => {
      if (node.parentIds && node.parentIds.length) {
        return node.parentIds;
      }
      return getNodeParents(node).map((parent) => parent._id);
    },
    parents: (node: NodeRecord) => getNodeParents(node),
  },
  Trigger: {
    resourceTemplate: (trigger: Trigger) =>
      getResourceTemplateById(trigger.resourceTemplateId ?? undefined),
  },
  Action: {
    resourceTemplate: (action: Action) =>
      getResourceTemplateById(action.resourceTemplateId ?? undefined),
  },
  Response: {
    platforms: (response: { platforms?: unknown[] }) =>
      response.platforms ?? [],
  },
  ResponsePlatform: {
    localeGroups: (platform: { localeGroups?: unknown[] }) =>
      platform.localeGroups ?? [],
  },
  ResponseLocaleGroup: {
    localeGroupId: (group: { localeGroupId?: string; localeGroup?: string }) =>
      group.localeGroupId ?? group.localeGroup ?? null,
    variations: (group: { variations?: unknown[] }) => group.variations ?? [],
  },
  ResponseVariation: {
    responses: (variation: { responses?: unknown }) =>
      variation.responses ?? null,
  },
};

loadData();

export default resolvers;
