import os
import glob

files = glob.glob('app/**/*.py', recursive=True)
for f in files:
    with open(f, 'r') as file:
        lines = file.readlines()
    
    # Remove any existing Annotated/typing imports that might conflict
    new_lines = [l for l in lines if 'from typing import' not in l]
    
    if any(kw in ''.join(lines) for kw in ['Annotated[', 'Any', 'List[', 'Dict[', 'Optional[']):
        # Add to top
        new_lines.insert(0, 'from typing import Annotated, Any, List, Dict, Optional\n')
        with open(f, 'w') as file:
            file.writelines(new_lines)
