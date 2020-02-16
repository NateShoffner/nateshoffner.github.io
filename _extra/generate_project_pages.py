"""

Generates markdown files for tags/categories based off of
frontmatter located in '_posts' files.

"""

import frontmatter
import os
import re
import urllib

from yaml import load, dump
try:
    from yaml import CLoader as Loader, CDumper as Dumper
except ImportError:
    from yaml import Loader, Dumper

template_path = "../_layouts/project.html"

def build_project_list():
    projects = []

    with open("../_data/projects.yml", "r") as f:
        project_data = load(f, Loader=Loader)
        
        for p in project_data:
            projects.append(p)

    return projects

def load_project_template():
    with open(template_path, "r") as f:
        metadata, content = frontmatter.parse(f.read())
        return (metadata, content)

def generate_markdown_files(projects, directory, template):
    if not os.path.exists(directory):
        os.makedirs(directory)

    for project in projects:
        sub_dir = os.path.join(directory, project["slug"])

        if not os.path.exists(sub_dir):
            os.makedirs(sub_dir)

        index = os.path.join(sub_dir, "index.html")

        metadata, content = template

        delimiter = metadata["generator_markup_delimiter"]

        escaped = re.escape(delimiter)
        ptrn = re.compile(r"^.*%s([a-zA-Z]*)%s.*$" % (escaped, escaped), re.MULTILINE)
        replaced = ptrn.sub(lambda m: m.group().replace(delimiter + m.group(1) + delimiter, project[m.group(1)], 1), content)
        print(replaced)
        with open(index, "w") as f:
            f.write("---\n")
            for m in metadata:
                value = metadata[m] # dear god this is sloppy
                if metadata[m].replace(delimiter, "") in project:
                    value = project[metadata[m].replace(delimiter, "")]
                f.write("%s: %s\n" % (m, value)) 
            f.write("---\n")
            f.write("\n")
            f.write(replaced)


print("Building project list...\n")
projects = build_project_list()

print("Loading project template...\n")
template = load_project_template()

print("Generating markdown files for projects...\n")
generate_markdown_files(projects, "../projects", template)