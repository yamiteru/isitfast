import { createId } from '@paralleldrive/cuid2';

export const compile_template = (
  ast_body,
  benchmark_ast,
  generator_ast
) => {
  const socket_class = `socket_class___${createId()}`;
  const socket_instance = `socket_instance___${createId()}`;
  const socket_fn = `socket_fn___${createId()}`;
  const buffer = `buffer___${createId()}`;
  const benchmark = `benchmark___${createId()}`;
  const generator = `generator___${createId()}`;
  const tmp = `tmp___${createId()}`;
  const blackbox = `blackbox___${createId()}`;

  return {
    "type": "Module",
    "span": {
      "start": 1,
      "end": 0,
      "ctxt": 0
    },
    "body": [
      {
        "type": "ExpressionStatement",
        "span": {
          "start": 0,
          "end": 0,
          "ctxt": 0
        },
        "expression": {
          "type": "StringLiteral",
          "span": {
            "start": 0,
            "end": 0,
            "ctxt": 0
          },
          "value": "use strict",
          "raw": "\"use strict\""
        }
      },
      {
        "type": "ImportDeclaration",
        "span": {
          "start": 0,
          "end": 0,
          "ctxt": 0
        },
        "specifiers": [
          {
            "type": "ImportSpecifier",
            "span": {
              "start": 0,
              "end": 0,
              "ctxt": 0
            },
            "local": {
              "type": "Identifier",
              "span": {
                "start": 0,
                "end": 0,
                "ctxt": 0
              },
              "value": socket_class,
              "optional": false
            },
            "imported": {
              "type": "Identifier",
              "span": {
                "start": 0,
                "end": 0,
                "ctxt": 0
              },
              "value": "Socket",
              "optional": false
            },
            "isTypeOnly": false
          }
        ],
        "source": {
          "type": "StringLiteral",
          "span": {
            "start": 0,
            "end": 0,
            "ctxt": 0
          },
          "value": "node:net",
          "raw": "\"node:net\""
        },
        "typeOnly": false,
        "with": null,
        "phase": "evaluation"
      },
      ...ast_body,
      {
        "type": "VariableDeclaration",
        "span": {
          "start": 0,
          "end": 0,
          "ctxt": 0
        },
        "kind": "const",
        "declare": false,
        "declarations": [
          {
            "type": "VariableDeclarator",
            "span": {
              "start": 0,
              "end": 0,
              "ctxt": 0
            },
            "id": {
              "type": "Identifier",
              "span": {
                "start": 0,
                "end": 0,
                "ctxt": 0
              },
              "value": benchmark,
              "optional": false,
              "typeAnnotation": null
            },
            "init": benchmark_ast,
            "definite": false
          }
        ]
      },
      {
        "type": "VariableDeclaration",
        "span": {
          "start": 0,
          "end": 0,
          "ctxt": 0
        },
        "kind": "const",
        "declare": false,
        "declarations": [
          {
            "type": "VariableDeclarator",
            "span": {
              "start": 0,
              "end": 0,
              "ctxt": 0
            },
            "id": {
              "type": "Identifier",
              "span": {
                "start": 0,
                "end": 0,
                "ctxt": 0
              },
              "value": socket_instance,
              "optional": false,
              "typeAnnotation": null
            },
            "init": {
              "type": "NewExpression",
              "span": {
                "start": 0,
                "end": 0,
                "ctxt": 0
              },
              "callee": {
                "type": "Identifier",
                "span": {
                  "start": 0,
                  "end": 0,
                  "ctxt": 0
                },
                "value": socket_class,
                "optional": false
              },
              "arguments": [
                {
                  "spread": null,
                  "expression": {
                    "type": "ObjectExpression",
                    "span": {
                      "start": 0,
                      "end": 0,
                      "ctxt": 0
                    },
                    "properties": [
                      {
                        "type": "KeyValueProperty",
                        "key": {
                          "type": "Identifier",
                          "span": {
                            "start": 0,
                            "end": 0,
                            "ctxt": 0
                          },
                          "value": "fd",
                          "optional": false
                        },
                        "value": {
                          "type": "NumericLiteral",
                          "span": {
                            "start": 0,
                            "end": 0,
                            "ctxt": 0
                          },
                          "value": 3,
                          "raw": "3"
                        }
                      },
                      {
                        "type": "KeyValueProperty",
                        "key": {
                          "type": "Identifier",
                          "span": {
                            "start": 0,
                            "end": 0,
                            "ctxt": 0
                          },
                          "value": "readable",
                          "optional": false
                        },
                        "value": {
                          "type": "BooleanLiteral",
                          "span": {
                            "start": 0,
                            "end": 0,
                            "ctxt": 0
                          },
                          "value": true
                        }
                      },
                      {
                        "type": "KeyValueProperty",
                        "key": {
                          "type": "Identifier",
                          "span": {
                            "start": 0,
                            "end": 0,
                            "ctxt": 0
                          },
                          "value": "writable",
                          "optional": false
                        },
                        "value": {
                          "type": "BooleanLiteral",
                          "span": {
                            "start": 0,
                            "end": 0,
                            "ctxt": 0
                          },
                          "value": true
                        }
                      }
                    ]
                  }
                }
              ],
              "typeArguments": null
            },
            "definite": false
          }
        ]
      },
      {
        "type": "VariableDeclaration",
        "span": {
          "start": 0,
          "end": 0,
          "ctxt": 0
        },
        "kind": "const",
        "declare": false,
        "declarations": [
          {
            "type": "VariableDeclarator",
            "span": {
              "start": 0,
              "end": 0,
              "ctxt": 0
            },
            "id": {
              "type": "Identifier",
              "span": {
                "start": 0,
                "end": 0,
                "ctxt": 0
              },
              "value": buffer,
              "optional": false,
              "typeAnnotation": null
            },
            "init": {
              "type": "CallExpression",
              "span": {
                "start": 0,
                "end": 0,
                "ctxt": 0
              },
              "callee": {
                "type": "MemberExpression",
                "span": {
                  "start": 0,
                  "end": 0,
                  "ctxt": 0
                },
                "object": {
                  "type": "Identifier",
                  "span": {
                    "start": 0,
                    "end": 0,
                    "ctxt": 0
                  },
                  "value": "Buffer",
                  "optional": false
                },
                "property": {
                  "type": "Identifier",
                  "span": {
                    "start": 0,
                    "end": 0,
                    "ctxt": 0
                  },
                  "value": "alloc",
                  "optional": false
                }
              },
              "arguments": [
                {
                  "spread": null,
                  "expression": {
                    "type": "NumericLiteral",
                    "span": {
                      "start": 0,
                      "end": 0,
                      "ctxt": 0
                    },
                    "value": 32,
                    "raw": "32"
                  }
                }
              ],
              "typeArguments": null
            },
            "definite": false
          }
        ]
      },
      {
        "type": "VariableDeclaration",
        "span": {
          "start": 0,
          "end": 0,
          "ctxt": 0
        },
        "kind": "const",
        "declare": false,
        "declarations": [
          {
            "type": "VariableDeclarator",
            "span": {
              "start": 0,
              "end": 0,
              "ctxt": 0
            },
            "id": {
              "type": "Identifier",
              "span": {
                "start": 0,
                "end": 0,
                "ctxt": 0
              },
              "value": generator,
              "optional": false,
              "typeAnnotation": null
            },
            "init": generator_ast,
            "definite": false
          }
        ]
      },
      {
        "type": "VariableDeclaration",
        "span": {
          "start": 0,
          "end": 0,
          "ctxt": 0
        },
        "kind": "let",
        "declare": false,
        "declarations": [
          {
            "type": "VariableDeclarator",
            "span": {
              "start": 0,
              "end": 0,
              "ctxt": 0
            },
            "id": {
              "type": "Identifier",
              "span": {
                "start": 0,
                "end": 0,
                "ctxt": 0
              },
              "value": tmp,
              "optional": false,
              "typeAnnotation": null
            },
            "init": {
              "type": "NumericLiteral",
              "span": {
                "start": 0,
                "end": 0,
                "ctxt": 0
              },
              "value": 0,
              "raw": "0"
            },
            "definite": false
          }
        ]
      },
      {
        "type": "FunctionDeclaration",
        "identifier": {
          "type": "Identifier",
          "span": {
            "start": 0,
            "end": 0,
            "ctxt": 0
          },
          "value": blackbox,
          "optional": false
        },
        "declare": false,
        "params": [
          {
            "type": "Parameter",
            "span": {
              "start": 0,
              "end": 0,
              "ctxt": 0
            },
            "decorators": [],
            "pat": {
              "type": "Identifier",
              "span": {
                "start": 0,
                "end": 0,
                "ctxt": 0
              },
              "value": "v",
              "optional": false,
              "typeAnnotation": null
            }
          }
        ],
        "decorators": [],
        "span": {
          "start": 0,
          "end": 0,
          "ctxt": 0
        },
        "body": {
          "type": "BlockStatement",
          "span": {
            "start": 0,
            "end": 0,
            "ctxt": 0
          },
          "stmts": [
            {
              "type": "ExpressionStatement",
              "span": {
                "start": 0,
                "end": 0,
                "ctxt": 0
              },
              "expression": {
                "type": "AssignmentExpression",
                "span": {
                  "start": 0,
                  "end": 0,
                  "ctxt": 0
                },
                "operator": "=",
                "left": {
                  "type": "Identifier",
                  "span": {
                    "start": 0,
                    "end": 0,
                    "ctxt": 0
                  },
                  "value": tmp,
                  "optional": false,
                  "typeAnnotation": null
                },
                "right": {
                  "type": "Identifier",
                  "span": {
                    "start": 0,
                    "end": 0,
                    "ctxt": 0
                  },
                  "value": "v",
                  "optional": false
                }
              }
            }
          ]
        },
        "generator": false,
        "async": false,
        "typeParameters": null,
        "returnType": null
      },
      {
        "type": "FunctionDeclaration",
        "identifier": {
          "type": "Identifier",
          "span": {
            "start": 0,
            "end": 0,
            "ctxt": 0
          },
          "value": socket_fn,
          "optional": false
        },
        "declare": false,
        "params": [],
        "decorators": [],
        "span": {
          "start": 0,
          "end": 0,
          "ctxt": 0
        },
        "body": {
          "type": "BlockStatement",
          "span": {
            "start": 0,
            "end": 0,
            "ctxt": 0
          },
          "stmts": [
            {
              "type": "VariableDeclaration",
              "span": {
                "start": 0,
                "end": 0,
                "ctxt": 0
              },
              "kind": "const",
              "declare": false,
              "declarations": [
                {
                  "type": "VariableDeclarator",
                  "span": {
                    "start": 0,
                    "end": 0,
                    "ctxt": 0
                  },
                  "id": {
                    "type": "Identifier",
                    "span": {
                      "start": 0,
                      "end": 0,
                      "ctxt": 0
                    },
                    "value": "data",
                    "optional": false,
                    "typeAnnotation": null
                  },
                  "init": {
                    "type": "CallExpression",
                    "span": {
                      "start": 0,
                      "end": 0,
                      "ctxt": 0
                    },
                    "callee": {
                      "type": "Identifier",
                      "span": {
                        "start": 0,
                        "end": 0,
                        "ctxt": 0
                      },
                      "value": generator,
                      "optional": false
                    },
                    "arguments": [],
                    "typeArguments": null
                  },
                  "definite": false
                }
              ]
            },
            {
              "type": "ExpressionStatement",
              "span": {
                "start": 0,
                "end": 0,
                "ctxt": 0
              },
              "expression": {
                "type": "CallExpression",
                "span": {
                  "start": 0,
                  "end": 0,
                  "ctxt": 0
                },
                "callee": {
                  "type": "MemberExpression",
                  "span": {
                    "start": 0,
                    "end": 0,
                    "ctxt": 0
                  },
                  "object": {
                    "type": "Identifier",
                    "span": {
                      "start": 0,
                      "end": 0,
                      "ctxt": 0
                    },
                    "value": buffer,
                    "optional": false
                  },
                  "property": {
                    "type": "Identifier",
                    "span": {
                      "start": 0,
                      "end": 0,
                      "ctxt": 0
                    },
                    "value": "writeUInt32LE",
                    "optional": false
                  }
                },
                "arguments": [
                  {
                    "spread": null,
                    "expression": {
                      "type": "NumericLiteral",
                      "span": {
                        "start": 0,
                        "end": 0,
                        "ctxt": 0
                      },
                      "value": 1,
                      "raw": "1"
                    }
                  },
                  {
                    "spread": null,
                    "expression": {
                      "type": "NumericLiteral",
                      "span": {
                        "start": 0,
                        "end": 0,
                        "ctxt": 0
                      },
                      "value": 0,
                      "raw": "0"
                    }
                  }
                ],
                "typeArguments": null
              }
            },
            {
              "type": "ExpressionStatement",
              "span": {
                "start": 0,
                "end": 0,
                "ctxt": 0
              },
              "expression": {
                "type": "CallExpression",
                "span": {
                  "start": 0,
                  "end": 0,
                  "ctxt": 0
                },
                "callee": {
                  "type": "MemberExpression",
                  "span": {
                    "start": 0,
                    "end": 0,
                    "ctxt": 0
                  },
                  "object": {
                    "type": "Identifier",
                    "span": {
                      "start": 0,
                      "end": 0,
                      "ctxt": 0
                    },
                    "value": buffer,
                    "optional": false
                  },
                  "property": {
                    "type": "Identifier",
                    "span": {
                      "start": 0,
                      "end": 0,
                      "ctxt": 0
                    },
                    "value": "writeBigUInt64LE",
                    "optional": false
                  }
                },
                "arguments": [
                  {
                    "spread": null,
                    "expression": {
                      "type": "CallExpression",
                      "span": {
                        "start": 0,
                        "end": 0,
                        "ctxt": 0
                      },
                      "callee": {
                        "type": "MemberExpression",
                        "span": {
                          "start": 0,
                          "end": 0,
                          "ctxt": 0
                        },
                        "object": {
                          "type": "MemberExpression",
                          "span": {
                            "start": 0,
                            "end": 0,
                            "ctxt": 0
                          },
                          "object": {
                            "type": "Identifier",
                            "span": {
                              "start": 0,
                              "end": 0,
                              "ctxt": 0
                            },
                            "value": "process",
                            "optional": false
                          },
                          "property": {
                            "type": "Identifier",
                            "span": {
                              "start": 0,
                              "end": 0,
                              "ctxt": 0
                            },
                            "value": "hrtime",
                            "optional": false
                          }
                        },
                        "property": {
                          "type": "Identifier",
                          "span": {
                            "start": 0,
                            "end": 0,
                            "ctxt": 0
                          },
                          "value": "bigint",
                          "optional": false
                        }
                      },
                      "arguments": [],
                      "typeArguments": null
                    }
                  },
                  {
                    "spread": null,
                    "expression": {
                      "type": "NumericLiteral",
                      "span": {
                        "start": 0,
                        "end": 0,
                        "ctxt": 0
                      },
                      "value": 4,
                      "raw": "4"
                    }
                  }
                ],
                "typeArguments": null
              }
            },
            {
              "type": "ExpressionStatement",
              "span": {
                "start": 0,
                "end": 0,
                "ctxt": 0
              },
              "expression": {
                "type": "CallExpression",
                "span": {
                  "start": 0,
                  "end": 0,
                  "ctxt": 0
                },
                "callee": {
                  "type": "MemberExpression",
                  "span": {
                    "start": 0,
                    "end": 0,
                    "ctxt": 0
                  },
                  "object": {
                    "type": "Identifier",
                    "span": {
                      "start": 0,
                      "end": 0,
                      "ctxt": 0
                    },
                    "value": buffer,
                    "optional": false
                  },
                  "property": {
                    "type": "Identifier",
                    "span": {
                      "start": 0,
                      "end": 0,
                      "ctxt": 0
                    },
                    "value": "writeUInt32LE",
                    "optional": false
                  }
                },
                "arguments": [
                  {
                    "spread": null,
                    "expression": {
                      "type": "MemberExpression",
                      "span": {
                        "start": 0,
                        "end": 0,
                        "ctxt": 0
                      },
                      "object": {
                        "type": "CallExpression",
                        "span": {
                          "start": 0,
                          "end": 0,
                          "ctxt": 0
                        },
                        "callee": {
                          "type": "MemberExpression",
                          "span": {
                            "start": 0,
                            "end": 0,
                            "ctxt": 0
                          },
                          "object": {
                            "type": "Identifier",
                            "span": {
                              "start": 0,
                              "end": 0,
                              "ctxt": 0
                            },
                            "value": "process",
                            "optional": false
                          },
                          "property": {
                            "type": "Identifier",
                            "span": {
                              "start": 0,
                              "end": 0,
                              "ctxt": 0
                            },
                            "value": "memoryUsage",
                            "optional": false
                          }
                        },
                        "arguments": [],
                        "typeArguments": null
                      },
                      "property": {
                        "type": "Identifier",
                        "span": {
                          "start": 0,
                          "end": 0,
                          "ctxt": 0
                        },
                        "value": "heapUsed",
                        "optional": false
                      }
                    }
                  },
                  {
                    "spread": null,
                    "expression": {
                      "type": "NumericLiteral",
                      "span": {
                        "start": 0,
                        "end": 0,
                        "ctxt": 0
                      },
                      "value": 20,
                      "raw": "20"
                    }
                  }
                ],
                "typeArguments": null
              }
            },
            {
              "type": "ExpressionStatement",
              "span": {
                "start": 0,
                "end": 0,
                "ctxt": 0
              },
              "expression": {
                "type": "CallExpression",
                "span": {
                  "start": 0,
                  "end": 0,
                  "ctxt": 0
                },
                "callee": {
                  "type": "Identifier",
                  "span": {
                    "start": 0,
                    "end": 0,
                    "ctxt": 0
                  },
                  "value": benchmark,
                  "optional": false
                },
                "arguments": [
                  {
                    "spread": null,
                    "expression": {
                      "type": "Identifier",
                      "span": {
                        "start": 0,
                        "end": 0,
                        "ctxt": 0
                      },
                      "value": "data",
                      "optional": false
                    }
                  },
                  {
                    "spread": null,
                    "expression": {
                      "type": "Identifier",
                      "span": {
                        "start": 0,
                        "end": 0,
                        "ctxt": 0
                      },
                      "value": blackbox,
                      "optional": false
                    }
                  }
                ],
                "typeArguments": null
              }
            },
            {
              "type": "ExpressionStatement",
              "span": {
                "start": 0,
                "end": 0,
                "ctxt": 0
              },
              "expression": {
                "type": "CallExpression",
                "span": {
                  "start": 0,
                  "end": 0,
                  "ctxt": 0
                },
                "callee": {
                  "type": "MemberExpression",
                  "span": {
                    "start": 0,
                    "end": 0,
                    "ctxt": 0
                  },
                  "object": {
                    "type": "Identifier",
                    "span": {
                      "start": 0,
                      "end": 0,
                      "ctxt": 0
                    },
                    "value": buffer,
                    "optional": false
                  },
                  "property": {
                    "type": "Identifier",
                    "span": {
                      "start": 0,
                      "end": 0,
                      "ctxt": 0
                    },
                    "value": "writeUInt32LE",
                    "optional": false
                  }
                },
                "arguments": [
                  {
                    "spread": null,
                    "expression": {
                      "type": "MemberExpression",
                      "span": {
                        "start": 0,
                        "end": 0,
                        "ctxt": 0
                      },
                      "object": {
                        "type": "CallExpression",
                        "span": {
                          "start": 0,
                          "end": 0,
                          "ctxt": 0
                        },
                        "callee": {
                          "type": "MemberExpression",
                          "span": {
                            "start": 0,
                            "end": 0,
                            "ctxt": 0
                          },
                          "object": {
                            "type": "Identifier",
                            "span": {
                              "start": 0,
                              "end": 0,
                              "ctxt": 0
                            },
                            "value": "process",
                            "optional": false
                          },
                          "property": {
                            "type": "Identifier",
                            "span": {
                              "start": 0,
                              "end": 0,
                              "ctxt": 0
                            },
                            "value": "memoryUsage",
                            "optional": false
                          }
                        },
                        "arguments": [],
                        "typeArguments": null
                      },
                      "property": {
                        "type": "Identifier",
                        "span": {
                          "start": 0,
                          "end": 0,
                          "ctxt": 0
                        },
                        "value": "heapUsed",
                        "optional": false
                      }
                    }
                  },
                  {
                    "spread": null,
                    "expression": {
                      "type": "NumericLiteral",
                      "span": {
                        "start": 0,
                        "end": 0,
                        "ctxt": 0
                      },
                      "value": 24,
                      "raw": "24"
                    }
                  }
                ],
                "typeArguments": null
              }
            },
            {
              "type": "ExpressionStatement",
              "span": {
                "start": 0,
                "end": 0,
                "ctxt": 0
              },
              "expression": {
                "type": "CallExpression",
                "span": {
                  "start": 0,
                  "end": 0,
                  "ctxt": 0
                },
                "callee": {
                  "type": "MemberExpression",
                  "span": {
                    "start": 0,
                    "end": 0,
                    "ctxt": 0
                  },
                  "object": {
                    "type": "Identifier",
                    "span": {
                      "start": 0,
                      "end": 0,
                      "ctxt": 0
                    },
                    "value": buffer,
                    "optional": false
                  },
                  "property": {
                    "type": "Identifier",
                    "span": {
                      "start": 0,
                      "end": 0,
                      "ctxt": 0
                    },
                    "value": "writeBigUInt64LE",
                    "optional": false
                  }
                },
                "arguments": [
                  {
                    "spread": null,
                    "expression": {
                      "type": "CallExpression",
                      "span": {
                        "start": 0,
                        "end": 0,
                        "ctxt": 0
                      },
                      "callee": {
                        "type": "MemberExpression",
                        "span": {
                          "start": 0,
                          "end": 0,
                          "ctxt": 0
                        },
                        "object": {
                          "type": "MemberExpression",
                          "span": {
                            "start": 0,
                            "end": 0,
                            "ctxt": 0
                          },
                          "object": {
                            "type": "Identifier",
                            "span": {
                              "start": 0,
                              "end": 0,
                              "ctxt": 0
                            },
                            "value": "process",
                            "optional": false
                          },
                          "property": {
                            "type": "Identifier",
                            "span": {
                              "start": 0,
                              "end": 0,
                              "ctxt": 0
                            },
                            "value": "hrtime",
                            "optional": false
                          }
                        },
                        "property": {
                          "type": "Identifier",
                          "span": {
                            "start": 0,
                            "end": 0,
                            "ctxt": 0
                          },
                          "value": "bigint",
                          "optional": false
                        }
                      },
                      "arguments": [],
                      "typeArguments": null
                    }
                  },
                  {
                    "spread": null,
                    "expression": {
                      "type": "NumericLiteral",
                      "span": {
                        "start": 0,
                        "end": 0,
                        "ctxt": 0
                      },
                      "value": 12,
                      "raw": "12"
                    }
                  }
                ],
                "typeArguments": null
              }
            },
            {
              "type": "ExpressionStatement",
              "span": {
                "start": 0,
                "end": 0,
                "ctxt": 0
              },
              "expression": {
                "type": "CallExpression",
                "span": {
                  "start": 0,
                  "end": 0,
                  "ctxt": 0
                },
                "callee": {
                  "type": "MemberExpression",
                  "span": {
                    "start": 0,
                    "end": 0,
                    "ctxt": 0
                  },
                  "object": {
                    "type": "Identifier",
                    "span": {
                      "start": 0,
                      "end": 0,
                      "ctxt": 0
                    },
                    "value": socket_instance,
                    "optional": false
                  },
                  "property": {
                    "type": "Identifier",
                    "span": {
                      "start": 0,
                      "end": 0,
                      "ctxt": 0
                    },
                    "value": "write",
                    "optional": false
                  }
                },
                "arguments": [
                  {
                    "spread": null,
                    "expression": {
                      "type": "Identifier",
                      "span": {
                        "start": 0,
                        "end": 0,
                        "ctxt": 0
                      },
                      "value": buffer,
                      "optional": false
                    }
                  }
                ],
                "typeArguments": null
              }
            }
          ]
        },
        "generator": false,
        "async": false,
        "typeParameters": null,
        "returnType": null
      },
      {
        "type": "ExpressionStatement",
        "span": {
          "start": 0,
          "end": 0,
          "ctxt": 0
        },
        "expression": {
          "type": "CallExpression",
          "span": {
            "start": 0,
            "end": 0,
            "ctxt": 0
          },
          "callee": {
            "type": "MemberExpression",
            "span": {
              "start": 0,
              "end": 0,
              "ctxt": 0
            },
            "object": {
              "type": "Identifier",
              "span": {
                "start": 0,
                "end": 0,
                "ctxt": 0
              },
              "value": socket_instance,
              "optional": false
            },
            "property": {
              "type": "Identifier",
              "span": {
                "start": 0,
                "end": 0,
                "ctxt": 0
              },
              "value": "on",
              "optional": false
            }
          },
          "arguments": [
            {
              "spread": null,
              "expression": {
                "type": "StringLiteral",
                "span": {
                  "start": 0,
                  "end": 0,
                  "ctxt": 0
                },
                "value": "data",
                "raw": "\"data\""
              }
            },
            {
              "spread": null,
              "expression": {
                "type": "Identifier",
                "span": {
                  "start": 0,
                  "end": 0,
                  "ctxt": 0
                },
                "value": socket_fn,
                "optional": false
              }
            }
          ],
          "typeArguments": null
        }
      },
      {
        "type": "ExpressionStatement",
        "span": {
          "start": 0,
          "end": 0,
          "ctxt": 0
        },
        "expression": {
          "type": "CallExpression",
          "span": {
            "start": 0,
            "end": 0,
            "ctxt": 0
          },
          "callee": {
            "type": "MemberExpression",
            "span": {
              "start": 0,
              "end": 0,
              "ctxt": 0
            },
            "object": {
              "type": "Identifier",
              "span": {
                "start": 0,
                "end": 0,
                "ctxt": 0
              },
              "value": buffer,
              "optional": false
            },
            "property": {
              "type": "Identifier",
              "span": {
                "start": 0,
                "end": 0,
                "ctxt": 0
              },
              "value": "writeUInt8",
              "optional": false
            }
          },
          "arguments": [
            {
              "spread": null,
              "expression": {
                "type": "NumericLiteral",
                "span": {
                  "start": 0,
                  "end": 0,
                  "ctxt": 0
                },
                "value": 0,
                "raw": "0"
              }
            },
            {
              "spread": null,
              "expression": {
                "type": "NumericLiteral",
                "span": {
                  "start": 0,
                  "end": 0,
                  "ctxt": 0
                },
                "value": 0,
                "raw": "0"
              }
            }
          ],
          "typeArguments": null
        }
      },
      {
        "type": "ExpressionStatement",
        "span": {
          "start": 0,
          "end": 0,
          "ctxt": 0
        },
        "expression": {
          "type": "CallExpression",
          "span": {
            "start": 0,
            "end": 0,
            "ctxt": 0
          },
          "callee": {
            "type": "MemberExpression",
            "span": {
              "start": 0,
              "end": 0,
              "ctxt": 0
            },
            "object": {
              "type": "Identifier",
              "span": {
                "start": 0,
                "end": 0,
                "ctxt": 0
              },
              "value": socket_instance,
              "optional": false
            },
            "property": {
              "type": "Identifier",
              "span": {
                "start": 0,
                "end": 0,
                "ctxt": 0
              },
              "value": "write",
              "optional": false
            }
          },
          "arguments": [
            {
              "spread": null,
              "expression": {
                "type": "Identifier",
                "span": {
                  "start": 0,
                  "end": 0,
                  "ctxt": 0
                },
                "value": buffer,
                "optional": false
              }
            }
          ],
          "typeArguments": null
        }
      }
    ],
    "interpreter": null
  };
};
