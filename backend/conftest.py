import sys
import os

root_dir = os.path.dirname(__file__)
apps_dir = os.path.join(root_dir, 'apps')
if root_dir not in sys.path:
    sys.path.insert(0, root_dir)
if apps_dir not in sys.path:
    sys.path.insert(0, apps_dir)

