from os import listdir, getcwd, makedirs
from os.path import isfile, join, exists
import shutil

from_to = {
"https://www.landleren.be/": "https://landleren.digitalinnovation.be/",
"https://status.landleren.be/": "https://status-landleren.digitalinnovation.be/",
"https://static.landleren.be/": "https://static-landleren.digitalinnovation.be/"
}

def get_full_path(path, file = False):
    if file:
        return str(join(getcwd(),path, file)).replace("\\","/")
    else:
        return str(join(getcwd(),path)).replace("\\","/")

def copy_file(file, from_path, to_path):
    if file.split(".")[-1] in ('html', 'css', 'js'):
        return copy_text_file(file, from_path, to_path)
        
    if not exists(get_full_path(to_path, file)):
        shutil.copyfile(join(get_full_path(from_path, file)), join(get_full_path(to_path, file)))
    return True
    

def copy_text_file(file, from_path, to_path):
    with open(get_full_path(from_path, file), "rt") as fin, open(get_full_path(to_path, file), "wt") as fout:
        for line in fin:
            
            for key, value in from_to.items():
                if key in line:
                    line = line.replace(key, value)
                
            fout.write(line)
    
    # print(file)
    return ""

print(getcwd())

def copy_folder(from_path, to_path):
    # from_path = get_full_path(from_path)
    print(from_path, to_path)
    
    files = listdir(get_full_path(from_path))
    for file in files:
        if isfile(join(get_full_path(from_path), file)):
            copy_file(file, from_path, to_path)
        else:
            if not exists(get_full_path(to_path, file)):
                makedirs(get_full_path(to_path, file))
            copy_folder(join(from_path, file), join(to_path, file))
    
    return True



copy_folder("landleren-static_original", "landleren-static")
copy_folder("landleren_original", "landleren")
