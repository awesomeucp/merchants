export interface UCPDiscoveryProfile {
  ucp: {
    version: string;
    services: Record<string, UCPService>;
    capabilities: UCPCapability[];
  };
  payment?: {
    handlers: PaymentHandler[];
  };
}

export interface UCPService {
  version: string;
  spec?: string;
  mcp?: {
    schema: string;
    endpoint: string;
  };
  rest?: {
    schema: string;
    endpoint: string;
  };
  embedded?: {
    schema: string;
    delegations?: string[];
  };
}

export interface UCPCapability {
  name: string;
  version: string;
  extends?: string;
  spec?: string;
  schema?: string;
}

export interface PaymentHandler {
  id: string;
  name: string;
  version: string;
  spec?: string;
  config_schema?: string;
  instrument_schemas?: string[];
  type?: 'first_party' | 'third_party';
  supported_tokens?: string[];
  supported_networks?: string[];
  config?: {
    api_version?: number;
    api_version_minor?: number;
    test_mode?: boolean;
    gateway?: string;
    merchant_id?: string;
    merchant_info?: {
      merchant_name: string;
      merchant_id?: string;
      merchant_origin?: string;
      auth_jwt?: string;
    };
    allowed_payment_methods?: Array<{
      type: string;
      parameters?: {
        allowed_auth_methods?: string[];
        allowed_card_networks?: string[];
      };
      tokenization_specification?: {
        type: string;
        parameters?: Array<{ key: string; value: string }>;
      };
    }>;
  };
}
