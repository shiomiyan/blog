alias n := new

new TITLE:
    hugo new posts/{{TITLE}}/index.md

serve:
    hugo server -D

lint:
    node_modules/.bin/textlint content/posts/**/*.md
