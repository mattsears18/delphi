import SimpleSchema from 'simpl-schema';
import Tabular from 'meteor/aldeed:tabular';
import { Template } from 'meteor/templating';


SimpleSchema.extendOptions(['autoform']);


Studies = new Mongo.Collection('studies');

Studies.allow({
  insert: function(userId, doc) {
    return !!userId;
  },
  update: function(userId, doc) {
    return !!userId;
  },
});

StudySchema = new SimpleSchema({
  name: {
    type: String,
    label: 'Name',
  },
  desc: {
    type: String,
    label: 'Description',
    optional: true,
    autoform: {
      rows: 8
    },
  },
  currentRound: {
    type: Number,
    label: 'Current Round (set to 0 for a new study)',
    defaultValue: 0,
  },
  open: {
    type: Boolean,
    defaultValue: true,
    autoform: {
      type: 'hidden',
    },
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


Studies.attachSchema(StudySchema);


StudiesTabular = new Tabular.Table({
  name: "Studies",
  collection: Studies,
  columns: [
    {
       data: "name",
       title: "Name",
       render: function(data, type, row, meta){
          data = '<a href="/studies/' + row._id + '">' + data + '</a>';
          return data;
       }
    },
    {data: "currentRound", title: "Current Round"},
    {
       title: "Results",
       render: function(data, type, row, meta){
          data = '<a href="/studies/' + row._id + '/results" class="btn btn-primary">View Study Results</a>';
          return data;
       }
    },
  ],
  searching: false,
  lengthChange: false,
  paging_type: 'full_numbers',
});


Studies.helpers({
  currentPairs() {
    study = this;
    return Pairs.find({
      studyId: study._id,
      round: study.currentRound,
    });
  },
  currentRatings() {
    study = this;
    pairs = study.currentPairs();

    pairIds = []

    pairs.forEach(function(pair) {
      pairIds.push(pair._id);
    });

    return Ratings.find({pairId: {$in: pairIds}});
  }
});

export default Studies;
