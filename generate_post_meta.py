"""

Generates 'tags.yml' and 'categores.yml' in '_data' based off of
frontmatter located in '_posts' files.

"""

import frontmatter
import glob
import os
import urllib
import yaml


class PostIndexer(object):

    def __init__(self, name):
        self.name = name
        self.slug = name.lower().replace(" ", "-")

tags_dict = {}
categories_dict = {}


def build_indexer_lists():
    post_files = glob.glob("_posts/*.html")

    for post_file in post_files:
        print 'Parsing: %s' % post_file
        with open(post_file, "r") as f:
            metadata, content = frontmatter.parse(f.read())
            tags = metadata["tags"] if "tags" in metadata else []
            categories = metadata[
                "categories"] if "categories" in metadata else []

            if len(tags) == 0:
                print '\tNo tags found'
            if len(categories) == 0:
                print '\tNo categories found'

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

    for indexer in dict.itervalues():
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
                 urllib.quote_plus(
                     indexer.slug)))
            f.write("---")


def generate_index_file(dict, filename):
    try:
        os.remove(filename)
    except OSError:
        pass

    with open(filename, "w") as f:
        for indexer in dict.itervalues():
            f.write("- slug: '%s'\n" % indexer.slug)
            f.write("  name: '%s'\n" % indexer.name)
            f.write("\n")


print "Building indexer lists...\n"
build_indexer_lists()

print "\nGenerating index file for tags...\n"
generate_index_file(tags_dict, "_data/tags.yml")

print "Generating markdown files for tags...\n"
generate_markdown_files("blog/tag", tags_dict, "blog_tags", "tag")

print "Generating index file for categories...\n"
generate_index_file(categories_dict, "_data/categories.yml")

print "Generating markdown files for categories...\n"
generate_markdown_files(
    "blog/category",
    categories_dict,
    "blog_categories",
    "category")
