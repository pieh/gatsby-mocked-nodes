/*

ABSOLUTELY DO NOT USE THIS!

In recent Gatsby versions this cause a lot of problems. Please make use of Schema Customization API
https://www.gatsbyjs.org/docs/schema-customization/ to define types for schema
*/






























const createTemporaryMockNodes = ({ emitter, actions}) => {
  const node = {
    id: 'mocked',
    parent: null,
    children: [],
    myField: 'yup',
    internal: {
      type: 'MockedNodeType',
      contentDigest: 'foo'
    }
  }

  actions.createNode(node)

  const onSchemaUpdate = () => {
    actions.deleteNode({ node })

    // poor man's "once"
    emitter.off(`SET_SCHEMA`, onSchemaUpdate)
  }

  // we will listen to when schema is set,
  // so we can immediately remove mocked nodes
  // as types are already produced, we don't need them anymore
  // THIS IS HACKY - emitter is considered more of a private API
  // and listening to internal SET_SCHEMA message might be begging
  // for problems
  emitter.on(`SET_SCHEMA`, onSchemaUpdate)
}

// that's pretty normal spot to create nodes
exports.sourceNodes = ({ emitter, actions }) => {
  createTemporaryMockNodes({ emitter, actions })
}

// this is just first API hook after "createPages" hook
// and before regenerating schema
exports.onPreExtractQueries = ({ emitter, actions }) => {
  createTemporaryMockNodes({ emitter, actions })
}
