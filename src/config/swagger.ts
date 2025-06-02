// Swagger configuration
const PORT: number = parseInt(process.env.PORT || '8080');

export const options = {
    definition: {
      openapi: '3.0.0',
      info: {
        title: 'Authentication API',
        version: '1.0.0',
        description: 'A comprehensive authentication API with user management features',
        contact: {
          name: 'API Support',
          email: 'support@yourapi.com'
        },
        license: {
          name: 'MIT',
          url: 'https://opensource.org/licenses/MIT'
        }
      },
      servers: [
        {
          url: `http://127.0.0.1:${PORT}`,
          description: 'Development server',
        },
        {
          url: 'https://your-production-url.com',
          description: 'Production server',
        }
      ],
      tags: [
        {
          name: 'Auth',
          description: 'Authentication endpoints for user registration, login, and password management',
        },
        {
          name: 'Users',
          description: 'User management operations',
        },
        {
          name: 'Welcome',
          description: 'Welcome and health check endpoints',
        }
      ],
      components: {
        securitySchemes: {
          bearerAuth: {
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'JWT',
            description: 'Enter JWT token in format: Bearer <token>'
          }
        },
        schemas: {
          User: {
            type: 'object',
            properties: {
              id: {
                type: 'integer',
                description: 'User unique identifier'
              },
              name: {
                type: 'string',
                description: 'User full name'
              },
              email: {
                type: 'string',
                format: 'email',
                description: 'User email address'
              },
              role: {
                type: 'string',
                enum: ['admin', 'user', 'moderator'],
                description: 'User role in the system'
              },
              isVerified: {
                type: 'boolean',
                description: 'Email verification status'
              },
              isActive: {
                type: 'boolean',
                description: 'Account active status'
              },
              createdAt: {
                type: 'string',
                format: 'date-time',
                description: 'Account creation timestamp'
              },
              updatedAt: {
                type: 'string',
                format: 'date-time',
                description: 'Last account update timestamp'
              }
            }
          },
          ApiResponse: {
            type: 'object',
            properties: {
              success: {
                type: 'boolean',
                description: 'Operation success status'
              },
              message: {
                type: 'string',
                description: 'Response message'
              },
              data: {
                type: 'object',
                description: 'Response data payload'
              }
            }
          },
          Error: {
            type: 'object',
            properties: {
              success: {
                type: 'boolean',
                example: false
              },
              message: {
                type: 'string',
                description: 'Error message'
              },
              error: {
                type: 'string',
                description: 'Detailed error information'
              }
            }
          },
          ValidationError: {
            type: 'object',
            properties: {
              success: {
                type: 'boolean',
                example: false
              },
              message: {
                type: 'string',
                example: 'Validation failed'
              },
              errors: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    field: {
                      type: 'string'
                    },
                    message: {
                      type: 'string'
                    }
                  }
                }
              }
            }
          }
        },
        responses: {
          UnauthorizedError: {
            description: 'Authentication required',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error'
                },
                example: {
                  success: false,
                  message: 'Authentication required'
                }
              }
            }
          },
          ForbiddenError: {
            description: 'Access forbidden',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error'
                },
                example: {
                  success: false,
                  message: 'Access forbidden'
                }
              }
            }
          },
          NotFoundError: {
            description: 'Resource not found',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error'
                },
                example: {
                  success: false,
                  message: 'Resource not found'
                }
              }
            }
          },
          ValidationError: {
            description: 'Validation error',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ValidationError'
                }
              }
            }
          },
          ServerError: {
            description: 'Internal server error',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error'
                },
                example: {
                  success: false,
                  message: 'Internal server error'
                }
              }
            }
          }
        }
      },
      security: [
        {
          bearerAuth: []
        }
      ]
    },
    apis: [
      './src/routes/*.ts',
      './routes/*.ts',
      './src/controllers/*.ts',
      './controllers/*.ts'
    ],
  };