export interface ResourceTemplate {
  _id: string;
  createdAt: number;
  updatedAt?: number;
  name: string;
  description?: string;
  schema?: unknown;
  integrationId?: string;
  functionString?: string | null;
  key?: string;
}

export interface Trigger {
  _id: string;
  createdAt: number;
  updatedAt?: number;
  name: string;
  description?: string;
  functionString?: string | null;
  resourceTemplateId?: string | null;
}

export interface Action {
  _id: string;
  createdAt: number;
  updatedAt?: number;
  name: string;
  description?: string;
  functionString?: string | null;
  resourceTemplateId?: string | null;
}

export interface ResponseVariation {
  name: string;
  responses?: unknown;
}

export interface ResponseLocaleGroup {
  localeGroupId?: string;
  localeGroup?: string;
  variations?: ResponseVariation[];
}

export interface ResponsePlatform {
  integrationId?: string;
  build?: number;
  localeGroups?: ResponseLocaleGroup[];
}

export interface Response {
  _id: string;
  createdAt: number;
  updatedAt?: number;
  name: string;
  description?: string;
  platforms?: ResponsePlatform[];
}

export interface NodeRecord {
  _id: string;
  createdAt: number;
  updatedAt?: number;
  name: string;
  description?: string;
  parents?: string[];
  parentIds?: string[];
  root?: boolean;
  trigger?: string | null;
  triggerId?: string | null;
  responses?: string[];
  responseIds?: string[];
  actions?: string[];
  actionIds?: string[];
  priority?: number;
  compositeId?: string;
  global?: boolean;
  colour?: string;
}

export interface DataCache {
  nodes: NodeRecord[];
  nodesById: Map<string, NodeRecord>;
  nodesByCompositeId: Map<string, NodeRecord>;
  triggers: Trigger[];
  triggersById: Map<string, Trigger>;
  actions: Action[];
  actionsById: Map<string, Action>;
  responses: Response[];
  responsesById: Map<string, Response>;
  resourceTemplates: ResourceTemplate[];
  resourceTemplatesById: Map<string, ResourceTemplate>;
}

export interface AuthenticatedUser {
  sub: string;
  [claim: string]: unknown;
}

export interface GraphQLContext {
  user: AuthenticatedUser;
}
