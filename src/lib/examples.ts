// Examples aligned with AWP Spec v0.1
// Source: https://github.com/agentwebprotocol/spec/blob/main/SPEC.md

export interface Example {
  title: string;
  description: string;
  filename: string;
  code: string;
}

export const examples: Example[] = [
  {
    title: "Airline",
    description:
      "A full-service airline with flight search, booking, check-in, and seat selection. Demonstrates dependencies, sensitivity levels, error recovery, and async execution.",
    filename: "skyways.com/agent.json",
    code: `{
  "awp_version": "0.1",
  "domain": "skyways.com",
  "intent": "Skyways Airlines — search flights, book tickets, check in, and select seats. Agents can help travelers find the best routes and fares across 200+ destinations.",
  "capabilities": {
    "streaming": false,
    "batch_actions": true,
    "webhooks": true,
    "pagination": "cursor",
    "idempotency": true
  },
  "auth": {
    "required_for": ["book_flight", "check_in", "select_seat"],
    "optional_for": ["search_flights"],
    "type": "oauth2",
    "token_expiry": "24h",
    "refresh_endpoint": "/api/auth/refresh"
  },
  "entities": {
    "flight": {
      "fields": {
        "flight_number": "string",
        "origin": "airport_code",
        "destination": "airport_code",
        "departure_time": "ISO8601",
        "price_usd": "float",
        "cabin_class": "enum[economy, business, first]"
      }
    },
    "booking": {
      "fields": {
        "booking_ref": "string",
        "flight_number": "string",
        "passenger_name": "string",
        "status": "enum[confirmed, cancelled, checked_in]"
      }
    }
  },
  "actions": [
    {
      "id": "search_flights",
      "description": "Search available flights between two airports on a given date",
      "auth_required": false,
      "inputs": {
        "origin": { "type": "airport_code", "required": true },
        "destination": { "type": "airport_code", "required": true },
        "date": { "type": "ISO8601", "required": true },
        "cabin_class": {
          "type": "enum",
          "options": ["economy", "business", "first"],
          "default": "economy"
        }
      },
      "outputs": {
        "flights": "array[flight]",
        "search_token": "string"
      },
      "endpoint": "/api/flights/search",
      "method": "POST",
      "rate_limit": "30/minute",
      "idempotency": {
        "supported": true,
        "key_field": "idempotency_key",
        "window": "24h"
      },
      "execution_model": "sync"
    },
    {
      "id": "book_flight",
      "description": "Book a flight for one or more passengers",
      "auth_required": true,
      "inputs": {
        "flight_number": { "type": "string", "required": true },
        "passengers": { "type": "array[object]", "required": true },
        "payment_token": { "type": "string", "required": true }
      },
      "outputs": {
        "booking": "object[booking]"
      },
      "endpoint": "/api/bookings",
      "method": "POST",
      "sensitivity": "destructive",
      "requires_human_confirmation": true,
      "reversible": true,
      "execution_model": "sync"
    },
    {
      "id": "check_in",
      "description": "Check in for a flight using booking reference",
      "auth_required": true,
      "inputs": {
        "booking_ref": { "type": "string", "required": true }
      },
      "outputs": {
        "boarding_pass": "object",
        "gate": "string"
      },
      "endpoint": "/api/checkin",
      "method": "POST",
      "sensitivity": "standard",
      "execution_model": "sync"
    },
    {
      "id": "select_seat",
      "description": "Select a seat assignment for a booking",
      "auth_required": true,
      "inputs": {
        "booking_ref": { "type": "string", "required": true },
        "seat": { "type": "string", "required": true, "description": "Seat code e.g. 12A" }
      },
      "outputs": {
        "confirmed_seat": "string"
      },
      "endpoint": "/api/bookings/{booking_ref}/seat",
      "method": "PUT",
      "execution_model": "sync"
    }
  ],
  "errors": {
    "AUTH_EXPIRED": {
      "recovery": "call /api/auth/refresh then retry original action"
    },
    "RATE_LIMITED": {
      "recovery": "wait 60 seconds then retry"
    },
    "SEAT_UNAVAILABLE": {
      "recovery": "retry search_flights with different parameters"
    },
    "INVALID_AIRPORT_CODE": {
      "recovery": "query /api/airports?search={input} to find valid codes"
    }
  },
  "dependencies": {
    "book_flight": ["search_flights"],
    "check_in": ["book_flight"],
    "select_seat": ["book_flight"]
  },
  "agent_hints": {
    "optimal_search_window": "search at least 24h before departure",
    "price_volatility": "high — cache search results max 5 minutes",
    "auth_note": "search does not require auth — only call auth when booking"
  },
  "agent_status": {
    "operational": true,
    "degraded_actions": [],
    "status_endpoint": "/api/status"
  }
}`,
  },
  {
    title: "E-Commerce",
    description:
      "An e-commerce storefront with product search, cart management, and checkout. Shows sensitivity on checkout, idempotency, and error recovery for stock issues.",
    filename: "shopnova.com/agent.json",
    code: `{
  "awp_version": "0.1",
  "domain": "shopnova.com",
  "intent": "ShopNova — browse products, manage shopping carts, and complete purchases. Agents can help users discover products, compare prices, and streamline checkout.",
  "capabilities": {
    "streaming": false,
    "batch_actions": false,
    "webhooks": true,
    "pagination": "cursor",
    "idempotency": true
  },
  "auth": {
    "required_for": ["add_to_cart", "checkout"],
    "optional_for": ["search_products"],
    "type": "bearer",
    "token_expiry": "7d"
  },
  "entities": {
    "product": {
      "fields": {
        "product_id": "string",
        "title": "string",
        "price_usd": "float",
        "in_stock": "boolean",
        "categories": "array[string]",
        "rating": "float"
      }
    },
    "cart": {
      "fields": {
        "cart_id": "string",
        "items": "array[object]",
        "total_usd": "float",
        "item_count": "integer"
      }
    },
    "order": {
      "fields": {
        "order_id": "string",
        "status": "enum[pending, confirmed, shipped, delivered]",
        "tracking_url": "url"
      }
    }
  },
  "actions": [
    {
      "id": "search_products",
      "description": "Search the product catalog by keyword, category, or price range",
      "auth_required": false,
      "inputs": {
        "query": { "type": "string", "required": true, "description": "Search terms" },
        "category": { "type": "string", "required": false },
        "max_price": { "type": "float", "required": false, "description": "Max price in USD" },
        "sort": {
          "type": "enum",
          "options": ["relevance", "price_asc", "price_desc", "rating"],
          "default": "relevance"
        }
      },
      "outputs": {
        "products": "array[product]",
        "total_results": "integer",
        "cursor": "string"
      },
      "endpoint": "/api/v2/products/search",
      "method": "POST",
      "rate_limit": "120/minute",
      "execution_model": "sync"
    },
    {
      "id": "add_to_cart",
      "description": "Add a product to the shopping cart",
      "auth_required": true,
      "inputs": {
        "product_id": { "type": "string", "required": true },
        "quantity": { "type": "integer", "required": true, "default": 1 }
      },
      "outputs": {
        "cart": "object[cart]"
      },
      "endpoint": "/api/v2/cart/items",
      "method": "POST",
      "execution_model": "sync"
    },
    {
      "id": "checkout",
      "description": "Complete purchase for the current cart",
      "auth_required": true,
      "inputs": {
        "cart_id": { "type": "string", "required": true },
        "payment_token": { "type": "string", "required": true },
        "shipping_address": { "type": "object", "required": true }
      },
      "outputs": {
        "order": "object[order]"
      },
      "endpoint": "/api/v2/checkout",
      "method": "POST",
      "sensitivity": "irreversible",
      "requires_human_confirmation": true,
      "reversible": false,
      "idempotency": {
        "supported": true,
        "key_field": "idempotency_key",
        "window": "1h"
      },
      "execution_model": "sync"
    }
  ],
  "errors": {
    "OUT_OF_STOCK": {
      "recovery": "remove item from cart or retry search_products for alternatives"
    },
    "CART_EXPIRED": {
      "recovery": "create a new cart and re-add items"
    },
    "PAYMENT_DECLINED": {
      "recovery": "prompt user for alternative payment method then retry checkout"
    },
    "INVALID_ADDRESS": {
      "recovery": "query /api/v2/address/validate with the address to get suggestions"
    }
  },
  "dependencies": {
    "checkout": ["add_to_cart"]
  },
  "agent_hints": {
    "cart_expiry": "carts expire after 24 hours of inactivity",
    "checkout_note": "always confirm total with user before checkout — prices may change",
    "stock_volatility": "popular items may go out of stock between search and cart add"
  },
  "agent_status": {
    "operational": true,
    "degraded_actions": [],
    "status_endpoint": "/api/v2/status"
  }
}`,
  },
  {
    title: "SaaS API",
    description:
      "A project management SaaS with workspace, task, and analytics APIs. Demonstrates async execution, sensitivity levels, and dependency chains.",
    filename: "taskflow.io/agent.json",
    code: `{
  "awp_version": "0.1",
  "domain": "taskflow.io",
  "intent": "TaskFlow — project management platform. Agents can create and manage projects, tasks, and team assignments. Ideal for automating project workflows and status reporting.",
  "capabilities": {
    "streaming": true,
    "batch_actions": true,
    "webhooks": true,
    "pagination": "offset",
    "idempotency": true
  },
  "auth": {
    "required_for": ["list_projects", "create_task", "update_task", "get_analytics", "delete_task"],
    "type": "api_key",
    "token_expiry": "never"
  },
  "entities": {
    "project": {
      "fields": {
        "project_id": "string",
        "name": "string",
        "status": "enum[active, archived, paused]",
        "member_count": "integer",
        "created_at": "ISO8601"
      }
    },
    "task": {
      "fields": {
        "task_id": "string",
        "title": "string",
        "status": "enum[todo, in_progress, review, done]",
        "assignee": "string",
        "priority": "enum[low, medium, high, critical]",
        "due_date": "ISO8601"
      }
    }
  },
  "actions": [
    {
      "id": "list_projects",
      "description": "List all projects in the workspace",
      "auth_required": true,
      "inputs": {
        "status": {
          "type": "enum",
          "options": ["active", "archived", "paused"],
          "required": false
        },
        "limit": { "type": "integer", "required": false, "default": 20 },
        "offset": { "type": "integer", "required": false, "default": 0 }
      },
      "outputs": {
        "projects": "array[project]",
        "total": "integer"
      },
      "endpoint": "/api/v1/projects",
      "method": "GET",
      "rate_limit": "60/minute",
      "execution_model": "sync"
    },
    {
      "id": "create_task",
      "description": "Create a new task in a project",
      "auth_required": true,
      "inputs": {
        "project_id": { "type": "string", "required": true },
        "title": { "type": "string", "required": true },
        "description": { "type": "string", "required": false },
        "assignee": { "type": "string", "required": false, "description": "User ID" },
        "priority": {
          "type": "enum",
          "options": ["low", "medium", "high", "critical"],
          "default": "medium"
        },
        "due_date": { "type": "ISO8601", "required": false }
      },
      "outputs": {
        "task": "object[task]"
      },
      "endpoint": "/api/v1/projects/{project_id}/tasks",
      "method": "POST",
      "sensitivity": "standard",
      "execution_model": "sync"
    },
    {
      "id": "update_task",
      "description": "Update task fields including status, assignee, or priority",
      "auth_required": true,
      "inputs": {
        "task_id": { "type": "string", "required": true },
        "status": { "type": "enum", "options": ["todo", "in_progress", "review", "done"], "required": false },
        "assignee": { "type": "string", "required": false },
        "priority": { "type": "enum", "options": ["low", "medium", "high", "critical"], "required": false }
      },
      "outputs": {
        "task": "object[task]"
      },
      "endpoint": "/api/v1/tasks/{task_id}",
      "method": "PATCH",
      "execution_model": "sync"
    },
    {
      "id": "delete_task",
      "description": "Permanently delete a task",
      "auth_required": true,
      "inputs": {
        "task_id": { "type": "string", "required": true }
      },
      "outputs": {
        "deleted": "boolean"
      },
      "endpoint": "/api/v1/tasks/{task_id}",
      "method": "DELETE",
      "sensitivity": "irreversible",
      "requires_human_confirmation": true,
      "reversible": false
    },
    {
      "id": "get_analytics",
      "description": "Get velocity and completion metrics for a project",
      "auth_required": true,
      "inputs": {
        "project_id": { "type": "string", "required": true },
        "period": {
          "type": "enum",
          "options": ["7d", "30d", "90d"],
          "default": "30d"
        }
      },
      "outputs": {
        "tasks_completed": "integer",
        "velocity": "float",
        "burndown": "array[object]"
      },
      "endpoint": "/api/v1/projects/{project_id}/analytics",
      "method": "GET",
      "execution_model": "async",
      "poll_endpoint": "/api/v1/jobs/{job_id}",
      "rate_limit": "10/minute"
    }
  ],
  "errors": {
    "PROJECT_NOT_FOUND": {
      "recovery": "call list_projects to get valid project IDs"
    },
    "TASK_LIMIT_REACHED": {
      "recovery": "archive or delete completed tasks, then retry"
    },
    "RATE_LIMITED": {
      "recovery": "wait 60 seconds then retry"
    },
    "PERMISSION_DENIED": {
      "recovery": "verify API key has required scopes for this action"
    }
  },
  "dependencies": {
    "create_task": ["list_projects"],
    "get_analytics": ["list_projects"]
  },
  "agent_hints": {
    "task_limits": "free tier limited to 100 tasks per project",
    "analytics_delay": "analytics endpoint is async — poll for results",
    "bulk_operations": "use batch_actions capability for creating multiple tasks"
  },
  "agent_status": {
    "operational": true,
    "degraded_actions": ["get_analytics"],
    "status_endpoint": "/api/v1/status"
  }
}`,
  },
];
