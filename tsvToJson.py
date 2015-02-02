txt = open("Gaz_counties_national.txt","r")
json = open("Gaz_counties_national.json","w")

previous_state = None
current_state = None

state_index = 0
county_index = 3
population_index = 4
headings = True

contents = txt.read().split('\n')

# begin JSON file
json.write("{\"name\": \"states\", \"children\": [{\n")

for line in contents:
  if len(line) > 0:
    if headings:
      headings = False
    else:
      previous_state = current_state
      words = line.split('\t')
      state = words[state_index]
      current_state = state
      county = words[county_index]
      population = words[population_index]
      if previous_state:
        if previous_state == current_state:
          json.write(",\n")
          json.write("\t\t{\"name\": \"" + county + "\", \"population\": " + population + "}")
        else:
          json.write("\t]\n},\n")
          json.write("{\n")
          json.write("\t\"name\": \"" + current_state + "\",\n")
          json.write("\t\"children\": [\n")
          json.write("\t\t{\"name\": \"" + county + "\", \"population\": " + population + "}")
      else:
        previous_state = current_state
        json.write("\t\"name\": \"" + current_state + "\",\n")
        json.write("\t\"children\": [\n")
        json.write("\t\t{\"name\": \"" + county + "\", \"population\": " + population + "}")

# end JSON file
json.write("\t]\n\t}\n]}")