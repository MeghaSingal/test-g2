1. Save "sas excel2.xlsx" file as a csv file and name it "series.csv".
2. (Optional) Some series names seem to have trailing space at the end. Do a find and replace of " ," to "," in the the csv file.
3. Rename to the column headers to (make sure the case sensitivity):
name, flag, naics, item, topic, subtopic, item_type, data_type, form, tbl, view, last_updated, val2018a1, val2017a1, val2016a1, val2015a1
These field names match what is in the sastsarfinal table in the DreamFactory API. We are making this update because I will also upload this mock data to json server. So we make sure to follow the same naming convention.
4. Convert the csv data to json here (https://www.csvjson.com/csv2json).
5. Minify the json file here (http://beautifytools.com/json-minifier.php).
6. We will use "My JSON Server", a fake onine REST server, to expose a Rest API online. We will copy the data from the minified json file to db.json. Then we need to edit the db.json and limit the size to 10KB max (That's the free plan https://my-json-server.typicode.com/pricing.).

The official site for My JSON Server: https://my-json-server.typicode.com/



CONVERT DIRECTLY FROM EXCEL TO JSON!! http://beautifytools.com/excel-to-json-converter.php