const createTemporaryMockNodes = ({ store, boundActionCreators }) => {
  const node = {
    id: "mocked",
    parent: null,
    children: [],
    myField: "yup",
    internal: {
      type: "MockedNodeType",
      contentDigest: "foo"
    }
  };

  boundActionCreators.createNode(node);

  // we will listen to when schema is set,
  // so we can immediately remove mocked nodes
  // as types are already produced, we don't need them anymore
  // THIS IS HACKY - store is considered more of a private API
  // and listening to internal SET_SCHEMA message might be begging
  // for problems
  const unsubscribe = store.subscribe(() => {
    const lastAction = store.getState().lastAction;
    if (lastAction.type === `SET_SCHEMA`) {
      boundActionCreators.deleteNode(node.id, node);
      unsubscribe();
    }
  });
};

// that's pretty normal spot to create nodes
exports.sourceNodes = ({ store, boundActionCreators }) => {
  createTemporaryMockNodes({ store, boundActionCreators });
};

// this is just first API hook after "createPages" hook
// and before regenerating schema
exports.onPreExtractQueries = ({ store, boundActionCreators }) => {
  createTemporaryMockNodes({ store, boundActionCreators });
};
