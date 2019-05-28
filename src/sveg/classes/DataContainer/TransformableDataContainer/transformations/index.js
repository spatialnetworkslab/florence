
import produce from 'immer'

import filter from './filter.js.js'
import select from './select.js.js'
import arrange from './arrange.js.js'
import rename from './rename.js.js'
import { mutate, transmute } from './mutate.js.js'
import summarise from './summarise.js.js'
import mutarise from './mutarise.js.js'
import groupBy from './groupBy.js.js'
import bin from './bin.js.js'
import dropNA from './dropNA.js.js'
// import reproject from './reproject.js'
import transform from './transform.js.js'

const transformations = {
  filter: produce(filter),
  select: produce(select),
  arrange: produce(arrange),
  rename: produce(rename),
  mutate: produce(mutate),
  transmute: produce(transmute),
  summarise,
  mutarise,
  groupBy,
  bin,
  dropNA: produce(dropNA),
  // reproject,
  transform
}

export default transformations
