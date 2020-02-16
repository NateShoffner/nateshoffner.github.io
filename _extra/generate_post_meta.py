"""

Generates markdown files for tags/categories based off of
frontmatter located in '_posts' files.

"""

import frontmatter
import glob
import os
import urllib
import urllib.parse

class PostIndexer(object):

    def __init__(self, name):
        self.name = name
        self.slug = name.lower().replace(" ", "-")

tags_dict = {}
categories_dict = {}

root_dir = os.path.dirname(os.path.dirname(os.path.realpath(__file__)))

def build_indexer_lists():
    post_files = glob.glob(os.path.join(root_dir, "_posts/*.*"))

    for post_file in post_files:
        print('Parsing: %s' % post_file)
        with open(post_file, "r") as f:
            metadata, content = frontmatter.parse(f.read())

            draft = False
            
            if "draft" in metadata and metadata["draft"]:
                print('\t**Draft**')
                draft = True

            if not draft:
                tags = metadata["tags"] if "tags" in metadata else []
                categories = metadata[
                    "categories"] if "categories" in metadata else []

                if len(tags) == 0:
                    print('\tNo tags found')
                if len(categories) == 0:
                    print('\tNo categories found')

                for tag in tags:
                    indexer = PostIndexer(tag)
                    if indexer.slug not in tags_dict:
                        tags_dict[indexer.slug] = indexer
                for category in categories:
                    indexer = PostIndexer(category)
                    if indexer.slug not in categories_dict:
                        categories_dict[indexer.slug] = indexer


def generate_markdown_files(directory, dict, layout, indexer_type):
    if not os.path.exists(directory):
        os.makedirs(directory)

    for indexer in dict.values():
        filename = "%s.md" % indexer.slug
        filename = filename[1:] if filename.startswith(".") else filename
        filename = os.path.join(directory, filename)
        with open(filename, "w") as f:
            f.write("---\n")
            f.write("layout: %s\n" % layout)
            f.write("%s: '%s'\n" % (indexer_type, indexer.slug))
            f.write(
                "permalink: /blog/%s/%s/\n" %
                (indexer_type,
                 urllib.parse.quote_plus(
                     indexer.slug)))
            f.write("---")

print("Building indexer lists...\n")
build_indexer_lists()

print("Generating markdown files for tags...\n")
generate_markdown_files(os.path.join(root_dir, "blog/tag"), tags_dict, "blog_tags", "tag")

print("Generating markdown files for categories...\n")
generate_markdown_files(
    os.path.join(root_dir, "blog/category"),
    categories_dict,
    "blog_categories",
    "category")
