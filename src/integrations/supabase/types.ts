export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      ai_agent_sessions: {
        Row: {
          agent_id: string | null
          ended_at: string | null
          id: string
          project_id: string | null
          result_data: Json | null
          session_data: Json | null
          session_name: string
          session_type: string
          started_at: string | null
          status: string | null
          user_id: string
        }
        Insert: {
          agent_id?: string | null
          ended_at?: string | null
          id?: string
          project_id?: string | null
          result_data?: Json | null
          session_data?: Json | null
          session_name: string
          session_type: string
          started_at?: string | null
          status?: string | null
          user_id: string
        }
        Update: {
          agent_id?: string | null
          ended_at?: string | null
          id?: string
          project_id?: string | null
          result_data?: Json | null
          session_data?: Json | null
          session_name?: string
          session_type?: string
          started_at?: string | null
          status?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "ai_agent_sessions_agent_id_fkey"
            columns: ["agent_id"]
            isOneToOne: false
            referencedRelation: "ai_agents"
            referencedColumns: ["id"]
          },
        ]
      }
      ai_agents: {
        Row: {
          agent_name: string
          agent_status: string | null
          agent_type: string
          capabilities: string[] | null
          configuration: Json
          created_at: string | null
          id: string
          is_active: boolean | null
          last_active_at: string | null
          model_config: Json | null
          model_version: string | null
          owner_id: string
          performance_metrics: Json | null
          project_id: string | null
          specializations: string[] | null
          training_data_url: string | null
          updated_at: string | null
          workspace_id: string | null
        }
        Insert: {
          agent_name: string
          agent_status?: string | null
          agent_type: string
          capabilities?: string[] | null
          configuration?: Json
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          last_active_at?: string | null
          model_config?: Json | null
          model_version?: string | null
          owner_id: string
          performance_metrics?: Json | null
          project_id?: string | null
          specializations?: string[] | null
          training_data_url?: string | null
          updated_at?: string | null
          workspace_id?: string | null
        }
        Update: {
          agent_name?: string
          agent_status?: string | null
          agent_type?: string
          capabilities?: string[] | null
          configuration?: Json
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          last_active_at?: string | null
          model_config?: Json | null
          model_version?: string | null
          owner_id?: string
          performance_metrics?: Json | null
          project_id?: string | null
          specializations?: string[] | null
          training_data_url?: string | null
          updated_at?: string | null
          workspace_id?: string | null
        }
        Relationships: []
      }
      ai_collaboration_sessions: {
        Row: {
          conflict_resolution_log: Json | null
          coordination_data: Json | null
          created_at: string | null
          ended_at: string | null
          id: string
          participating_agents: string[] | null
          participating_users: string[] | null
          project_id: string
          session_name: string
          session_status: string | null
          shared_context: Json | null
        }
        Insert: {
          conflict_resolution_log?: Json | null
          coordination_data?: Json | null
          created_at?: string | null
          ended_at?: string | null
          id?: string
          participating_agents?: string[] | null
          participating_users?: string[] | null
          project_id: string
          session_name: string
          session_status?: string | null
          shared_context?: Json | null
        }
        Update: {
          conflict_resolution_log?: Json | null
          coordination_data?: Json | null
          created_at?: string | null
          ended_at?: string | null
          id?: string
          participating_agents?: string[] | null
          participating_users?: string[] | null
          project_id?: string
          session_name?: string
          session_status?: string | null
          shared_context?: Json | null
        }
        Relationships: []
      }
      ai_model_registry: {
        Row: {
          created_at: string | null
          file_size: number | null
          hardware_requirements: Json | null
          id: string
          is_active: boolean | null
          model_metadata: Json | null
          model_name: string
          model_type: string
          model_url: string
          performance_benchmarks: Json | null
          supported_operations: string[] | null
          updated_at: string | null
          version: string
        }
        Insert: {
          created_at?: string | null
          file_size?: number | null
          hardware_requirements?: Json | null
          id?: string
          is_active?: boolean | null
          model_metadata?: Json | null
          model_name: string
          model_type: string
          model_url: string
          performance_benchmarks?: Json | null
          supported_operations?: string[] | null
          updated_at?: string | null
          version: string
        }
        Update: {
          created_at?: string | null
          file_size?: number | null
          hardware_requirements?: Json | null
          id?: string
          is_active?: boolean | null
          model_metadata?: Json | null
          model_name?: string
          model_type?: string
          model_url?: string
          performance_benchmarks?: Json | null
          supported_operations?: string[] | null
          updated_at?: string | null
          version?: string
        }
        Relationships: []
      }
      ai_models: {
        Row: {
          accuracy_score: number | null
          created_at: string | null
          deployed_at: string | null
          id: string
          is_public: boolean | null
          model_file_url: string
          model_name: string
          model_type: string
          model_version: string
          parameters: Json | null
          performance_metrics: Json | null
          training_data_url: string | null
          training_status: string | null
          updated_at: string | null
          usage_count: number | null
          user_id: string
        }
        Insert: {
          accuracy_score?: number | null
          created_at?: string | null
          deployed_at?: string | null
          id?: string
          is_public?: boolean | null
          model_file_url: string
          model_name: string
          model_type: string
          model_version: string
          parameters?: Json | null
          performance_metrics?: Json | null
          training_data_url?: string | null
          training_status?: string | null
          updated_at?: string | null
          usage_count?: number | null
          user_id: string
        }
        Update: {
          accuracy_score?: number | null
          created_at?: string | null
          deployed_at?: string | null
          id?: string
          is_public?: boolean | null
          model_file_url?: string
          model_name?: string
          model_type?: string
          model_version?: string
          parameters?: Json | null
          performance_metrics?: Json | null
          training_data_url?: string | null
          training_status?: string | null
          updated_at?: string | null
          usage_count?: number | null
          user_id?: string
        }
        Relationships: []
      }
      ai_training_data: {
        Row: {
          actual_output: Json | null
          agent_id: string | null
          context_data: Json | null
          created_at: string | null
          data_type: string
          expected_output: Json | null
          feedback_score: number | null
          id: string
          input_data: Json
          user_id: string | null
        }
        Insert: {
          actual_output?: Json | null
          agent_id?: string | null
          context_data?: Json | null
          created_at?: string | null
          data_type: string
          expected_output?: Json | null
          feedback_score?: number | null
          id?: string
          input_data: Json
          user_id?: string | null
        }
        Update: {
          actual_output?: Json | null
          agent_id?: string | null
          context_data?: Json | null
          created_at?: string | null
          data_type?: string
          expected_output?: Json | null
          feedback_score?: number | null
          id?: string
          input_data?: Json
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ai_training_data_agent_id_fkey"
            columns: ["agent_id"]
            isOneToOne: false
            referencedRelation: "ai_agents"
            referencedColumns: ["id"]
          },
        ]
      }
      animation_data: {
        Row: {
          animation_name: string
          created_at: string | null
          duration: number | null
          fps: number | null
          id: string
          is_active: boolean | null
          keyframes: Json | null
          project_id: string
          rigging_data: Json | null
          timeline_data: Json
          updated_at: string | null
        }
        Insert: {
          animation_name: string
          created_at?: string | null
          duration?: number | null
          fps?: number | null
          id?: string
          is_active?: boolean | null
          keyframes?: Json | null
          project_id: string
          rigging_data?: Json | null
          timeline_data?: Json
          updated_at?: string | null
        }
        Update: {
          animation_name?: string
          created_at?: string | null
          duration?: number | null
          fps?: number | null
          id?: string
          is_active?: boolean | null
          keyframes?: Json | null
          project_id?: string
          rigging_data?: Json | null
          timeline_data?: Json
          updated_at?: string | null
        }
        Relationships: []
      }
      api_key_usage_logs: {
        Row: {
          api_key_id: string
          cost_estimate: number | null
          error_message: string | null
          function_name: string
          id: string
          request_metadata: Json | null
          response_status: number | null
          usage_amount: number | null
          usage_type: string
          used_at: string | null
        }
        Insert: {
          api_key_id: string
          cost_estimate?: number | null
          error_message?: string | null
          function_name: string
          id?: string
          request_metadata?: Json | null
          response_status?: number | null
          usage_amount?: number | null
          usage_type: string
          used_at?: string | null
        }
        Update: {
          api_key_id?: string
          cost_estimate?: number | null
          error_message?: string | null
          function_name?: string
          id?: string
          request_metadata?: Json | null
          response_status?: number | null
          usage_amount?: number | null
          usage_type?: string
          used_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "api_key_usage_logs_api_key_id_fkey"
            columns: ["api_key_id"]
            isOneToOne: false
            referencedRelation: "api_keys"
            referencedColumns: ["id"]
          },
        ]
      }
      api_keys: {
        Row: {
          created_at: string | null
          current_usage: number | null
          encrypted_key: string
          expires_at: string | null
          id: string
          is_active: boolean | null
          key_name: string
          owner_id: string
          project_id: string | null
          service_provider: string
          updated_at: string | null
          usage_limit: number | null
        }
        Insert: {
          created_at?: string | null
          current_usage?: number | null
          encrypted_key: string
          expires_at?: string | null
          id?: string
          is_active?: boolean | null
          key_name: string
          owner_id: string
          project_id?: string | null
          service_provider: string
          updated_at?: string | null
          usage_limit?: number | null
        }
        Update: {
          created_at?: string | null
          current_usage?: number | null
          encrypted_key?: string
          expires_at?: string | null
          id?: string
          is_active?: boolean | null
          key_name?: string
          owner_id?: string
          project_id?: string | null
          service_provider?: string
          updated_at?: string | null
          usage_limit?: number | null
        }
        Relationships: []
      }
      assets: {
        Row: {
          asset_type: string
          created_at: string | null
          dimensions: Json | null
          file_format: string
          file_size_bytes: number
          file_url: string
          id: string
          is_optimized: boolean | null
          metadata: Json | null
          name: string
          optimization_level: string | null
          polygon_count: number | null
          project_id: string
          tags: string[] | null
          texture_resolution: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          asset_type: string
          created_at?: string | null
          dimensions?: Json | null
          file_format: string
          file_size_bytes: number
          file_url: string
          id?: string
          is_optimized?: boolean | null
          metadata?: Json | null
          name: string
          optimization_level?: string | null
          polygon_count?: number | null
          project_id: string
          tags?: string[] | null
          texture_resolution?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          asset_type?: string
          created_at?: string | null
          dimensions?: Json | null
          file_format?: string
          file_size_bytes?: number
          file_url?: string
          id?: string
          is_optimized?: boolean | null
          metadata?: Json | null
          name?: string
          optimization_level?: string | null
          polygon_count?: number | null
          project_id?: string
          tags?: string[] | null
          texture_resolution?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      behavior_analysis: {
        Row: {
          behavior_type: string
          confidence_score: number | null
          created_at: string | null
          id: string
          interaction_data: Json
          pattern_analysis: Json | null
          recommendations: Json | null
          session_id: string | null
          user_id: string
        }
        Insert: {
          behavior_type: string
          confidence_score?: number | null
          created_at?: string | null
          id?: string
          interaction_data?: Json
          pattern_analysis?: Json | null
          recommendations?: Json | null
          session_id?: string | null
          user_id: string
        }
        Update: {
          behavior_type?: string
          confidence_score?: number | null
          created_at?: string | null
          id?: string
          interaction_data?: Json
          pattern_analysis?: Json | null
          recommendations?: Json | null
          session_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "behavior_analysis_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "ai_agent_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      cad_constraints: {
        Row: {
          constraint_type: string
          created_at: string | null
          entity_ids: string[]
          id: string
          is_satisfied: boolean | null
          parameters: Json | null
          priority: number | null
          sketch_id: string | null
        }
        Insert: {
          constraint_type: string
          created_at?: string | null
          entity_ids: string[]
          id?: string
          is_satisfied?: boolean | null
          parameters?: Json | null
          priority?: number | null
          sketch_id?: string | null
        }
        Update: {
          constraint_type?: string
          created_at?: string | null
          entity_ids?: string[]
          id?: string
          is_satisfied?: boolean | null
          parameters?: Json | null
          priority?: number | null
          sketch_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "cad_constraints_sketch_id_fkey"
            columns: ["sketch_id"]
            isOneToOne: false
            referencedRelation: "cad_sketches"
            referencedColumns: ["id"]
          },
        ]
      }
      cad_features: {
        Row: {
          created_at: string | null
          dependencies: string[] | null
          feature_name: string
          feature_type: string
          id: string
          is_active: boolean | null
          is_suppressed: boolean | null
          level: number | null
          order_index: number
          parameters: Json
          parent_id: string | null
          project_id: string
          tree_path: string[] | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          dependencies?: string[] | null
          feature_name: string
          feature_type: string
          id?: string
          is_active?: boolean | null
          is_suppressed?: boolean | null
          level?: number | null
          order_index?: number
          parameters?: Json
          parent_id?: string | null
          project_id: string
          tree_path?: string[] | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          dependencies?: string[] | null
          feature_name?: string
          feature_type?: string
          id?: string
          is_active?: boolean | null
          is_suppressed?: boolean | null
          level?: number | null
          order_index?: number
          parameters?: Json
          parent_id?: string | null
          project_id?: string
          tree_path?: string[] | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "cad_features_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "cad_features"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cad_features_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "cad_projects"
            referencedColumns: ["id"]
          },
        ]
      }
      cad_geometry: {
        Row: {
          created_at: string | null
          entity_type: string
          id: string
          is_construction: boolean | null
          parameters: Json
          sketch_id: string | null
          style: Json | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          entity_type: string
          id?: string
          is_construction?: boolean | null
          parameters: Json
          sketch_id?: string | null
          style?: Json | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          entity_type?: string
          id?: string
          is_construction?: boolean | null
          parameters?: Json
          sketch_id?: string | null
          style?: Json | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "cad_geometry_sketch_id_fkey"
            columns: ["sketch_id"]
            isOneToOne: false
            referencedRelation: "cad_sketches"
            referencedColumns: ["id"]
          },
        ]
      }
      cad_history: {
        Row: {
          id: string
          operation_data: Json
          operation_type: string
          project_id: string
          timestamp: string | null
          user_id: string | null
        }
        Insert: {
          id?: string
          operation_data: Json
          operation_type: string
          project_id: string
          timestamp?: string | null
          user_id?: string | null
        }
        Update: {
          id?: string
          operation_data?: Json
          operation_type?: string
          project_id?: string
          timestamp?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "cad_history_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "cad_projects"
            referencedColumns: ["id"]
          },
        ]
      }
      cad_measurements: {
        Row: {
          created_at: string | null
          entity_ids: string[]
          id: string
          measurement_type: string
          project_id: string
          result_data: Json | null
          result_value: number | null
          units: string
        }
        Insert: {
          created_at?: string | null
          entity_ids: string[]
          id?: string
          measurement_type: string
          project_id: string
          result_data?: Json | null
          result_value?: number | null
          units: string
        }
        Update: {
          created_at?: string | null
          entity_ids?: string[]
          id?: string
          measurement_type?: string
          project_id?: string
          result_data?: Json | null
          result_value?: number | null
          units?: string
        }
        Relationships: [
          {
            foreignKeyName: "cad_measurements_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "cad_projects"
            referencedColumns: ["id"]
          },
        ]
      }
      cad_nurbs: {
        Row: {
          control_points: Json
          created_at: string | null
          degree_u: number
          degree_v: number | null
          feature_id: string
          id: string
          is_closed_u: boolean | null
          is_closed_v: boolean | null
          is_rational: boolean | null
          knot_vector_u: number[]
          knot_vector_v: number[] | null
          nurbs_type: string
          weights: number[] | null
        }
        Insert: {
          control_points: Json
          created_at?: string | null
          degree_u: number
          degree_v?: number | null
          feature_id: string
          id?: string
          is_closed_u?: boolean | null
          is_closed_v?: boolean | null
          is_rational?: boolean | null
          knot_vector_u: number[]
          knot_vector_v?: number[] | null
          nurbs_type: string
          weights?: number[] | null
        }
        Update: {
          control_points?: Json
          created_at?: string | null
          degree_u?: number
          degree_v?: number | null
          feature_id?: string
          id?: string
          is_closed_u?: boolean | null
          is_closed_v?: boolean | null
          is_rational?: boolean | null
          knot_vector_u?: number[]
          knot_vector_v?: number[] | null
          nurbs_type?: string
          weights?: number[] | null
        }
        Relationships: [
          {
            foreignKeyName: "cad_nurbs_feature_id_fkey"
            columns: ["feature_id"]
            isOneToOne: false
            referencedRelation: "cad_features"
            referencedColumns: ["id"]
          },
        ]
      }
      cad_projects: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          name: string
          precision_tolerance: number | null
          units: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          name: string
          precision_tolerance?: number | null
          units?: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
          precision_tolerance?: number | null
          units?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      cad_sketches: {
        Row: {
          constraints: Json[] | null
          created_at: string | null
          feature_id: string
          geometry_entities: Json[] | null
          id: string
          is_fully_constrained: boolean | null
          sketch_plane: Json
          updated_at: string | null
        }
        Insert: {
          constraints?: Json[] | null
          created_at?: string | null
          feature_id: string
          geometry_entities?: Json[] | null
          id?: string
          is_fully_constrained?: boolean | null
          sketch_plane: Json
          updated_at?: string | null
        }
        Update: {
          constraints?: Json[] | null
          created_at?: string | null
          feature_id?: string
          geometry_entities?: Json[] | null
          id?: string
          is_fully_constrained?: boolean | null
          sketch_plane?: Json
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "cad_sketches_feature_id_fkey"
            columns: ["feature_id"]
            isOneToOne: false
            referencedRelation: "cad_features"
            referencedColumns: ["id"]
          },
        ]
      }
      collaboration: {
        Row: {
          current_tool: string | null
          cursor_position: Json | null
          id: string
          is_active: boolean | null
          joined_at: string | null
          last_heartbeat: string | null
          left_at: string | null
          project_id: string
          role: string | null
          selections: Json | null
          session_id: string
          user_id: string
          viewport_state: Json | null
        }
        Insert: {
          current_tool?: string | null
          cursor_position?: Json | null
          id?: string
          is_active?: boolean | null
          joined_at?: string | null
          last_heartbeat?: string | null
          left_at?: string | null
          project_id: string
          role?: string | null
          selections?: Json | null
          session_id: string
          user_id: string
          viewport_state?: Json | null
        }
        Update: {
          current_tool?: string | null
          cursor_position?: Json | null
          id?: string
          is_active?: boolean | null
          joined_at?: string | null
          last_heartbeat?: string | null
          left_at?: string | null
          project_id?: string
          role?: string | null
          selections?: Json | null
          session_id?: string
          user_id?: string
          viewport_state?: Json | null
        }
        Relationships: []
      }
      collaboration_sessions: {
        Row: {
          cursor_positions: Json | null
          ended_at: string | null
          host_user_id: string
          id: string
          is_active: boolean | null
          participants: string[] | null
          project_id: string
          session_data: Json | null
          session_name: string
          started_at: string | null
        }
        Insert: {
          cursor_positions?: Json | null
          ended_at?: string | null
          host_user_id: string
          id?: string
          is_active?: boolean | null
          participants?: string[] | null
          project_id: string
          session_data?: Json | null
          session_name: string
          started_at?: string | null
        }
        Update: {
          cursor_positions?: Json | null
          ended_at?: string | null
          host_user_id?: string
          id?: string
          is_active?: boolean | null
          participants?: string[] | null
          project_id?: string
          session_data?: Json | null
          session_name?: string
          started_at?: string | null
        }
        Relationships: []
      }
      computer_vision_analysis: {
        Row: {
          analysis_type: string
          confidence_scores: Json | null
          created_at: string | null
          detection_results: Json | null
          frame_count: number | null
          id: string
          input_source_url: string | null
          input_type: string
          pose_data: Json | null
          processing_time_ms: number | null
          session_id: string | null
          tracking_data: Json | null
        }
        Insert: {
          analysis_type: string
          confidence_scores?: Json | null
          created_at?: string | null
          detection_results?: Json | null
          frame_count?: number | null
          id?: string
          input_source_url?: string | null
          input_type: string
          pose_data?: Json | null
          processing_time_ms?: number | null
          session_id?: string | null
          tracking_data?: Json | null
        }
        Update: {
          analysis_type?: string
          confidence_scores?: Json | null
          created_at?: string | null
          detection_results?: Json | null
          frame_count?: number | null
          id?: string
          input_source_url?: string | null
          input_type?: string
          pose_data?: Json | null
          processing_time_ms?: number | null
          session_id?: string | null
          tracking_data?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "computer_vision_analysis_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "ai_agent_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      knowledge_base: {
        Row: {
          category: string
          content: string
          content_embedding: string | null
          created_by: string | null
          difficulty_level: string | null
          document_title: string
          document_type: string
          helpful_votes: number | null
          id: string
          is_public: boolean | null
          last_updated: string | null
          metadata: Json | null
          subcategory: string | null
          tags: string[] | null
          view_count: number | null
        }
        Insert: {
          category: string
          content: string
          content_embedding?: string | null
          created_by?: string | null
          difficulty_level?: string | null
          document_title: string
          document_type: string
          helpful_votes?: number | null
          id?: string
          is_public?: boolean | null
          last_updated?: string | null
          metadata?: Json | null
          subcategory?: string | null
          tags?: string[] | null
          view_count?: number | null
        }
        Update: {
          category?: string
          content?: string
          content_embedding?: string | null
          created_by?: string | null
          difficulty_level?: string | null
          document_title?: string
          document_type?: string
          helpful_votes?: number | null
          id?: string
          is_public?: boolean | null
          last_updated?: string | null
          metadata?: Json | null
          subcategory?: string | null
          tags?: string[] | null
          view_count?: number | null
        }
        Relationships: []
      }
      marketplace_items: {
        Row: {
          created_at: string | null
          description: string | null
          downloads: number | null
          file_url: string | null
          id: string
          is_approved: boolean | null
          item_name: string
          item_type: string
          preview_images: string[] | null
          price: number | null
          rating: number | null
          seller_id: string
          tags: string[] | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          downloads?: number | null
          file_url?: string | null
          id?: string
          is_approved?: boolean | null
          item_name: string
          item_type: string
          preview_images?: string[] | null
          price?: number | null
          rating?: number | null
          seller_id: string
          tags?: string[] | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          downloads?: number | null
          file_url?: string | null
          id?: string
          is_approved?: boolean | null
          item_name?: string
          item_type?: string
          preview_images?: string[] | null
          price?: number | null
          rating?: number | null
          seller_id?: string
          tags?: string[] | null
          updated_at?: string | null
        }
        Relationships: []
      }
      materials_library: {
        Row: {
          created_at: string | null
          id: string
          is_public: boolean | null
          material_name: string
          material_type: string
          node_graph: Json | null
          owner_id: string
          preview_url: string | null
          properties: Json
          sculpting_properties: Json | null
          tags: string[] | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_public?: boolean | null
          material_name: string
          material_type: string
          node_graph?: Json | null
          owner_id: string
          preview_url?: string | null
          properties?: Json
          sculpting_properties?: Json | null
          tags?: string[] | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          is_public?: boolean | null
          material_name?: string
          material_type?: string
          node_graph?: Json | null
          owner_id?: string
          preview_url?: string | null
          properties?: Json
          sculpting_properties?: Json | null
          tags?: string[] | null
          updated_at?: string | null
        }
        Relationships: []
      }
      physics_simulations: {
        Row: {
          completed_at: string | null
          configuration: Json
          created_at: string | null
          error_message: string | null
          execution_time_ms: number | null
          id: string
          iterations: number | null
          mesh_resolution_level: number | null
          project_id: string
          quality_level: string | null
          results_data: Json | null
          sculpted_mesh_id: string | null
          simulation_name: string
          simulation_type: string
          status: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          completed_at?: string | null
          configuration?: Json
          created_at?: string | null
          error_message?: string | null
          execution_time_ms?: number | null
          id?: string
          iterations?: number | null
          mesh_resolution_level?: number | null
          project_id: string
          quality_level?: string | null
          results_data?: Json | null
          sculpted_mesh_id?: string | null
          simulation_name: string
          simulation_type: string
          status?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          completed_at?: string | null
          configuration?: Json
          created_at?: string | null
          error_message?: string | null
          execution_time_ms?: number | null
          id?: string
          iterations?: number | null
          mesh_resolution_level?: number | null
          project_id?: string
          quality_level?: string | null
          results_data?: Json | null
          sculpted_mesh_id?: string | null
          simulation_name?: string
          simulation_type?: string
          status?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      procedural_generation_templates: {
        Row: {
          algorithm_type: string
          constraints: Json | null
          created_at: string | null
          created_by: string
          generation_type: string
          id: string
          is_public: boolean | null
          output_format: string | null
          parameters: Json
          preview_image_url: string | null
          rules: Json | null
          template_name: string
          updated_at: string | null
          usage_count: number | null
        }
        Insert: {
          algorithm_type: string
          constraints?: Json | null
          created_at?: string | null
          created_by: string
          generation_type: string
          id?: string
          is_public?: boolean | null
          output_format?: string | null
          parameters?: Json
          preview_image_url?: string | null
          rules?: Json | null
          template_name: string
          updated_at?: string | null
          usage_count?: number | null
        }
        Update: {
          algorithm_type?: string
          constraints?: Json | null
          created_at?: string | null
          created_by?: string
          generation_type?: string
          id?: string
          is_public?: boolean | null
          output_format?: string | null
          parameters?: Json
          preview_image_url?: string | null
          rules?: Json | null
          template_name?: string
          updated_at?: string | null
          usage_count?: number | null
        }
        Relationships: []
      }
      projects: {
        Row: {
          created_at: string | null
          description: string | null
          file_size_bytes: number | null
          id: string
          is_public: boolean | null
          last_opened_at: string | null
          metadata: Json | null
          project_type: string | null
          sculpting_settings: Json | null
          sharing_permissions: Json | null
          supports_sculpting: boolean | null
          tags: string[] | null
          thumbnail_url: string | null
          title: string
          updated_at: string | null
          user_id: string
          version: number | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          file_size_bytes?: number | null
          id?: string
          is_public?: boolean | null
          last_opened_at?: string | null
          metadata?: Json | null
          project_type?: string | null
          sculpting_settings?: Json | null
          sharing_permissions?: Json | null
          supports_sculpting?: boolean | null
          tags?: string[] | null
          thumbnail_url?: string | null
          title: string
          updated_at?: string | null
          user_id: string
          version?: number | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          file_size_bytes?: number | null
          id?: string
          is_public?: boolean | null
          last_opened_at?: string | null
          metadata?: Json | null
          project_type?: string | null
          sculpting_settings?: Json | null
          sharing_permissions?: Json | null
          supports_sculpting?: boolean | null
          tags?: string[] | null
          thumbnail_url?: string | null
          title?: string
          updated_at?: string | null
          user_id?: string
          version?: number | null
        }
        Relationships: []
      }
      sculpting_brushes: {
        Row: {
          algorithm_type: string | null
          alpha_texture_url: string | null
          brush_type: string
          created_at: string | null
          description: string | null
          displacement_mode: string | null
          downloads_count: number | null
          falloff_curve_data: Json | null
          height_map_url: string | null
          id: string
          is_custom: boolean | null
          is_public: boolean | null
          name: string
          rating: number | null
          settings: Json | null
          tags: string[] | null
          updated_at: string | null
          usage_count: number | null
          user_id: string | null
        }
        Insert: {
          algorithm_type?: string | null
          alpha_texture_url?: string | null
          brush_type: string
          created_at?: string | null
          description?: string | null
          displacement_mode?: string | null
          downloads_count?: number | null
          falloff_curve_data?: Json | null
          height_map_url?: string | null
          id?: string
          is_custom?: boolean | null
          is_public?: boolean | null
          name: string
          rating?: number | null
          settings?: Json | null
          tags?: string[] | null
          updated_at?: string | null
          usage_count?: number | null
          user_id?: string | null
        }
        Update: {
          algorithm_type?: string | null
          alpha_texture_url?: string | null
          brush_type?: string
          created_at?: string | null
          description?: string | null
          displacement_mode?: string | null
          downloads_count?: number | null
          falloff_curve_data?: Json | null
          height_map_url?: string | null
          id?: string
          is_custom?: boolean | null
          is_public?: boolean | null
          name?: string
          rating?: number | null
          settings?: Json | null
          tags?: string[] | null
          updated_at?: string | null
          usage_count?: number | null
          user_id?: string | null
        }
        Relationships: []
      }
      sculpting_layers: {
        Row: {
          blend_mode: string | null
          brush_settings: Json | null
          created_at: string | null
          displacement_data: Json | null
          file_size_bytes: number | null
          id: string
          is_locked: boolean | null
          is_visible: boolean | null
          layer_type: string | null
          mask_data: Json | null
          modification_count: number | null
          name: string
          opacity: number | null
          order_index: number
          sculpting_project_id: string | null
          subdivision_level: number | null
          updated_at: string | null
          vertex_count: number | null
          vertex_data_url: string | null
        }
        Insert: {
          blend_mode?: string | null
          brush_settings?: Json | null
          created_at?: string | null
          displacement_data?: Json | null
          file_size_bytes?: number | null
          id?: string
          is_locked?: boolean | null
          is_visible?: boolean | null
          layer_type?: string | null
          mask_data?: Json | null
          modification_count?: number | null
          name: string
          opacity?: number | null
          order_index?: number
          sculpting_project_id?: string | null
          subdivision_level?: number | null
          updated_at?: string | null
          vertex_count?: number | null
          vertex_data_url?: string | null
        }
        Update: {
          blend_mode?: string | null
          brush_settings?: Json | null
          created_at?: string | null
          displacement_data?: Json | null
          file_size_bytes?: number | null
          id?: string
          is_locked?: boolean | null
          is_visible?: boolean | null
          layer_type?: string | null
          mask_data?: Json | null
          modification_count?: number | null
          name?: string
          opacity?: number | null
          order_index?: number
          sculpting_project_id?: string | null
          subdivision_level?: number | null
          updated_at?: string | null
          vertex_count?: number | null
          vertex_data_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "sculpting_layers_sculpting_project_id_fkey"
            columns: ["sculpting_project_id"]
            isOneToOne: false
            referencedRelation: "sculpting_projects"
            referencedColumns: ["id"]
          },
        ]
      }
      sculpting_operations: {
        Row: {
          affected_vertices: number[] | null
          brush_id: string | null
          brush_settings: Json | null
          can_undo: boolean | null
          created_at: string | null
          gpu_memory_used_mb: number | null
          id: string
          is_significant: boolean | null
          layer_id: string | null
          operation_index: number
          operation_type: string
          processing_time_ms: number | null
          sculpting_session_id: string | null
          stroke_data: Json | null
          vertex_deltas: Json | null
          vertices_processed: number | null
        }
        Insert: {
          affected_vertices?: number[] | null
          brush_id?: string | null
          brush_settings?: Json | null
          can_undo?: boolean | null
          created_at?: string | null
          gpu_memory_used_mb?: number | null
          id?: string
          is_significant?: boolean | null
          layer_id?: string | null
          operation_index: number
          operation_type: string
          processing_time_ms?: number | null
          sculpting_session_id?: string | null
          stroke_data?: Json | null
          vertex_deltas?: Json | null
          vertices_processed?: number | null
        }
        Update: {
          affected_vertices?: number[] | null
          brush_id?: string | null
          brush_settings?: Json | null
          can_undo?: boolean | null
          created_at?: string | null
          gpu_memory_used_mb?: number | null
          id?: string
          is_significant?: boolean | null
          layer_id?: string | null
          operation_index?: number
          operation_type?: string
          processing_time_ms?: number | null
          sculpting_session_id?: string | null
          stroke_data?: Json | null
          vertex_deltas?: Json | null
          vertices_processed?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "sculpting_operations_brush_id_fkey"
            columns: ["brush_id"]
            isOneToOne: false
            referencedRelation: "sculpting_brushes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sculpting_operations_layer_id_fkey"
            columns: ["layer_id"]
            isOneToOne: false
            referencedRelation: "sculpting_layers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sculpting_operations_sculpting_session_id_fkey"
            columns: ["sculpting_session_id"]
            isOneToOne: false
            referencedRelation: "sculpting_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      sculpting_projects: {
        Row: {
          base_mesh_data: Json | null
          created_at: string | null
          current_subdivision_level: number | null
          description: string | null
          face_count: number | null
          file_size_bytes: number | null
          id: string
          max_subdivision_level: number | null
          name: string
          performance_settings: Json | null
          project_id: string | null
          sculpt_resolution_settings: Json | null
          symmetry_settings: Json | null
          thumbnail_url: string | null
          updated_at: string | null
          user_id: string | null
          vertex_count: number | null
        }
        Insert: {
          base_mesh_data?: Json | null
          created_at?: string | null
          current_subdivision_level?: number | null
          description?: string | null
          face_count?: number | null
          file_size_bytes?: number | null
          id?: string
          max_subdivision_level?: number | null
          name: string
          performance_settings?: Json | null
          project_id?: string | null
          sculpt_resolution_settings?: Json | null
          symmetry_settings?: Json | null
          thumbnail_url?: string | null
          updated_at?: string | null
          user_id?: string | null
          vertex_count?: number | null
        }
        Update: {
          base_mesh_data?: Json | null
          created_at?: string | null
          current_subdivision_level?: number | null
          description?: string | null
          face_count?: number | null
          file_size_bytes?: number | null
          id?: string
          max_subdivision_level?: number | null
          name?: string
          performance_settings?: Json | null
          project_id?: string | null
          sculpt_resolution_settings?: Json | null
          symmetry_settings?: Json | null
          thumbnail_url?: string | null
          updated_at?: string | null
          user_id?: string | null
          vertex_count?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "sculpting_projects_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      sculpting_sessions: {
        Row: {
          avg_fps: number | null
          brush_strokes_count: number | null
          collaborators: string[] | null
          created_at: string | null
          duration_seconds: number | null
          ended_at: string | null
          frame_drops: number | null
          id: string
          is_active: boolean | null
          is_collaborative: boolean | null
          max_fps: number | null
          memory_usage_mb: number | null
          min_fps: number | null
          sculpt_settings: Json | null
          sculpting_project_id: string | null
          session_type: string | null
          started_at: string | null
          undo_stack_depth: number | null
          updated_at: string | null
          user_id: string | null
          vertices_modified: number | null
        }
        Insert: {
          avg_fps?: number | null
          brush_strokes_count?: number | null
          collaborators?: string[] | null
          created_at?: string | null
          duration_seconds?: number | null
          ended_at?: string | null
          frame_drops?: number | null
          id?: string
          is_active?: boolean | null
          is_collaborative?: boolean | null
          max_fps?: number | null
          memory_usage_mb?: number | null
          min_fps?: number | null
          sculpt_settings?: Json | null
          sculpting_project_id?: string | null
          session_type?: string | null
          started_at?: string | null
          undo_stack_depth?: number | null
          updated_at?: string | null
          user_id?: string | null
          vertices_modified?: number | null
        }
        Update: {
          avg_fps?: number | null
          brush_strokes_count?: number | null
          collaborators?: string[] | null
          created_at?: string | null
          duration_seconds?: number | null
          ended_at?: string | null
          frame_drops?: number | null
          id?: string
          is_active?: boolean | null
          is_collaborative?: boolean | null
          max_fps?: number | null
          memory_usage_mb?: number | null
          min_fps?: number | null
          sculpt_settings?: Json | null
          sculpting_project_id?: string | null
          session_type?: string | null
          started_at?: string | null
          undo_stack_depth?: number | null
          updated_at?: string | null
          user_id?: string | null
          vertices_modified?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "sculpting_sessions_sculpting_project_id_fkey"
            columns: ["sculpting_project_id"]
            isOneToOne: false
            referencedRelation: "sculpting_projects"
            referencedColumns: ["id"]
          },
        ]
      }
      spatial_intelligence_data: {
        Row: {
          accessibility_data: Json | null
          analysis_results: Json | null
          analyzed_by: string | null
          building_code_compliance: Json | null
          created_at: string | null
          created_by: string
          energy_efficiency: Json | null
          flow_analysis: Json | null
          geometry_data: Json
          id: string
          lighting_analysis: Json | null
          optimization_suggestions: Json | null
          project_id: string
          space_name: string
          space_type: string | null
          updated_at: string | null
        }
        Insert: {
          accessibility_data?: Json | null
          analysis_results?: Json | null
          analyzed_by?: string | null
          building_code_compliance?: Json | null
          created_at?: string | null
          created_by: string
          energy_efficiency?: Json | null
          flow_analysis?: Json | null
          geometry_data: Json
          id?: string
          lighting_analysis?: Json | null
          optimization_suggestions?: Json | null
          project_id: string
          space_name: string
          space_type?: string | null
          updated_at?: string | null
        }
        Update: {
          accessibility_data?: Json | null
          analysis_results?: Json | null
          analyzed_by?: string | null
          building_code_compliance?: Json | null
          created_at?: string | null
          created_by?: string
          energy_efficiency?: Json | null
          flow_analysis?: Json | null
          geometry_data?: Json
          id?: string
          lighting_analysis?: Json | null
          optimization_suggestions?: Json | null
          project_id?: string
          space_name?: string
          space_type?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "spatial_intelligence_data_analyzed_by_fkey"
            columns: ["analyzed_by"]
            isOneToOne: false
            referencedRelation: "ai_agents"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          avatar_url: string | null
          collaboration_settings: Json | null
          created_at: string | null
          email: string
          full_name: string | null
          id: string
          last_active_at: string | null
          preferences: Json | null
          role: string | null
          subscription_tier: string | null
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          collaboration_settings?: Json | null
          created_at?: string | null
          email: string
          full_name?: string | null
          id?: string
          last_active_at?: string | null
          preferences?: Json | null
          role?: string | null
          subscription_tier?: string | null
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          collaboration_settings?: Json | null
          created_at?: string | null
          email?: string
          full_name?: string | null
          id?: string
          last_active_at?: string | null
          preferences?: Json | null
          role?: string | null
          subscription_tier?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      validate_api_key_usage: {
        Args: { key_id: string }
        Returns: boolean
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
