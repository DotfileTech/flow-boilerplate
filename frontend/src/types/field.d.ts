export type Field = {
  id: string;
  nested?: string;
  type?: string;
  required: boolean;
  enabled: boolean;
  hasHelper?: boolean;
  options?: string[];
};
