Template.Criteria.events({
  'click .new-recipe': function() {
    Session.set('newCriterion', true);
  }
});

Template.Criteria.helpers({
  criteria: () => {
    return Criteria.find({});
  },
  selector() {
    return {study: FlowRouter.getParam('studyId')};
  }
});
