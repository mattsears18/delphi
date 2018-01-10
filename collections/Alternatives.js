import SimpleSchema from 'simpl-schema';
import Tabular from 'meteor/aldeed:tabular';
import { Template } from 'meteor/templating';


SimpleSchema.extendOptions(['autoform']);


Alternatives = new Mongo.Collection('alternatives');

Alternatives.allow({
  insert: function(userId, doc) {
    return !!userId;
  },
  update: function(userId, doc) {
    return !!userId;
  },
});

AlternativeSchema = new SimpleSchema({
  number: {
    type: Number,
    label: 'Number',
  },
  name: {
    type: String,
    label: 'Name',
  },
  desc: {
    type: String,
    label: 'Description',
    autoform: {
      rows: 8
    },
    optional: true,
  },
  studyId: {
    type: String,
    label: 'Study',
    optional: true,
    autoform: {
      value: function() {
        return FlowRouter.getParam('studyId');
      },
      type: 'hidden'
    }
  },
  ownerId: {
    type: String,
    autoValue: function() {
      return this.userId;
    },
    autoform: {
      type: 'hidden',
    },
  },
  createdAt: {
    type: Date,
    label: 'Create At',
    autoValue: function() {
      return new Date();
    },
    autoform: {
      type: 'hidden',
    },
  },
});


Alternatives.attachSchema(AlternativeSchema);


AlternativesTabular = new Tabular.Table({
  name: "Alternatives",
  collection: Alternatives,
  columns: [
    {
       data: "name",
       title: "Name",
       render: function(data, type, row, meta){
          data = '<a href="/studies/' + FlowRouter.getParam('studyId') + '/alternatives/' + row._id + '">' + data + '</a>';
          return data;
       }
    },
    {data: "desc", title: "Description"},
  ],
  lengthChange: false,
});


Alternatives.helpers({
  pairs() {
    return Pairs.find({alternativeId: this._id});
  },
  finalValues() {
    criteria = Criteria.find({studyId: this.studyId});

    if(criteria) {
      data = {};
      data.scores = [];

      criteria.forEach(function(criterion) {
        score = {};

        score.criterionId = criterion._id;
        score.finalValue = 6;
        score.weight = criterion.weight;
        score.weightedValue = score.finalValue * 0.01 * score.weight;
        score.consensusRound = 4,

        data.scores.push(score);
      });

      data.finalScore = 0

      data.scores.forEach(function(score){
        data.finalScore += score.weightedValue;
      });

      return data;
    }
  },
});


export default Alternatives;
