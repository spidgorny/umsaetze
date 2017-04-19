/**
 * Created by DEPIDSVY on 17.10.2016.
 */
// const parser = require('./src/Sync/ParseCSV.js');
import path = require('path');
import TestImport from "./test/TestImport";

let sb = new TestImport();
sb.testLongest();
sb.testParser();
sb.testAccounting();
sb.testImport();
