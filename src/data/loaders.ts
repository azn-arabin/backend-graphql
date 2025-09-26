import fs from "node:fs";
import path from "node:path";
import type {
  Action,
  DataCache,
  NodeRecord,
  ResourceTemplate,
  Response,
  Trigger,
} from "../types.js";

const DATA_FILES = {
  nodes: "node.json",
  responses: "response.json",
  triggers: "trigger.json",
  actions: "action.json",
  resourceTemplates: "resourceTemplate.json",
} as const;

function readJson<T>(fileName: string): T {
  const filePath = path.resolve(process.cwd(), fileName);
  const raw = fs.readFileSync(filePath, "utf-8");
  return JSON.parse(raw) as T;
}

let cache: DataCache | null = null;

export function loadData(): DataCache {
  if (!cache) {
    const nodes = readJson<NodeRecord[]>(DATA_FILES.nodes);
    const responses = readJson<Response[]>(DATA_FILES.responses);
    const triggers = readJson<Trigger[]>(DATA_FILES.triggers);
    const actions = readJson<Action[]>(DATA_FILES.actions);
    const resourceTemplates = readJson<ResourceTemplate[]>(
      DATA_FILES.resourceTemplates
    );

    cache = {
      nodes,
      responses,
      triggers,
      actions,
      resourceTemplates,
      nodesById: new Map(nodes.map((node) => [node._id, node])),
      nodesByCompositeId: new Map(
        nodes
          .filter((node) => typeof node.compositeId === "string")
          .map((node) => [node.compositeId as string, node])
      ),
      responsesById: new Map(
        responses.map((response) => [response._id, response])
      ),
      triggersById: new Map(triggers.map((trigger) => [trigger._id, trigger])),
      actionsById: new Map(actions.map((action) => [action._id, action])),
      resourceTemplatesById: new Map(
        resourceTemplates.map((rt) => [rt._id, rt])
      ),
    };
  }

  return cache;
}

export function getNodeById(
  nodeId: string | null | undefined
): NodeRecord | null {
  if (!nodeId) {
    return null;
  }
  const { nodesById } = loadData();
  return nodesById.get(nodeId) ?? null;
}

export function getNodeParents(
  node: NodeRecord | null | undefined
): NodeRecord[] {
  if (!node) {
    return [];
  }

  const parentCompositeIds = node.parents ?? [];
  if (!parentCompositeIds.length) {
    return [];
  }

  const { nodesByCompositeId } = loadData();
  return parentCompositeIds
    .map((compositeId) => nodesByCompositeId.get(compositeId))
    .filter((parent): parent is NodeRecord => Boolean(parent));
}

export function getTriggerById(
  triggerId: string | null | undefined
): Trigger | null {
  if (!triggerId) {
    return null;
  }
  const { triggersById } = loadData();
  return triggersById.get(triggerId) ?? null;
}

export function getResponseById(
  responseId: string | null | undefined
): Response | null {
  if (!responseId) {
    return null;
  }
  const { responsesById } = loadData();
  return responsesById.get(responseId) ?? null;
}

export function getActionById(
  actionId: string | null | undefined
): Action | null {
  if (!actionId) {
    return null;
  }
  const { actionsById } = loadData();
  return actionsById.get(actionId) ?? null;
}

export function getResourceTemplateById(
  templateId: string | null | undefined
): ResourceTemplate | null {
  if (!templateId) {
    return null;
  }
  const { resourceTemplatesById } = loadData();
  return resourceTemplatesById.get(templateId) ?? null;
}
