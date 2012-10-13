# Concerning building naclports (libs necessary for cocos2d)
# The makefile depends on the NACL_PACKAGES_BITSIZE environment variable
# (this is especially true for building 64 bit libraries)
# . . . consider the following:
# export NACL_PACKAGES_BITSIZE=32; ./nacl-SDL-1.2.14.sh
# export NACL_PACKAGES_BITSIZE=64; ./nacl-SDL-1.2.14.sh


PROJECT:=HelloWorld

# Project Build flags
WARNINGS:=-Wno-long-long -Wall -Wswitch-enum
#CXXFLAGS:=-pthread -std=gnu++98 -s -O2 $(WARNINGS)
CXXFLAGS:=-pthread -std=gnu++98 -O0 -g $(WARNINGS)

MKDIR:= python $(NACL_SDK_ROOT)/tools/oshelpers.py mkdir

#
# Compute tool paths
#
#
OSNAME:=$(shell python $(NACL_SDK_ROOT)/tools/getos.py)
TC_PATH:=$(abspath $(NACL_SDK_ROOT)/toolchain/$(OSNAME)_x86_newlib)
CXX:=$(TC_PATH)/bin/i686-nacl-g++

#
# Disable DOS PATH warning when using Cygwin based tools Windows
#
CYGWIN ?= nodosfilewarning
export CYGWIN

all: $(PROJECT)_x86_32.nexe $(PROJECT)_x86_64.nexe

INCLUDE_REL := ../../lib/cocos2dx

INCLUDE_DIRS := $(INCLUDE_REL)/cocos2dx $(INCLUDE_REL)/cocos2dx/include $(INCLUDE_REL)/cocos2dx/kazmath/include $(INCLUDE_REL)/cocos2dx/platform $(INCLUDE_REL)/cocos2dx/platform/nacl \
				$(TC_PATH)/i686-nacl/usr/include/libxml2 $(TC_PATH)/i686-nacl/usr/include/libpng12 $(TC_PATH)/i686-nacl/usr/include
INCLUDE_DIRS := $(addprefix -I, $(INCLUDE_DIRS))

SRC_DIRS := cocos2dx \
			cocos2dx/actions \
			cocos2dx/base_nodes \
			cocos2dx/cocoa \
			cocos2dx/effects \
			cocos2dx/extensions \
			cocos2dx/extensions/CCNotificationCenter \
			cocos2dx/extensions/CCControlExtension \
			cocos2dx/extensions/CCListView \
			cocos2dx/extensions/CCTextureWatcher \
			cocos2dx/extensions/CCBReader \
			cocos2dx/extensions/CCScrollView \
			cocos2dx/kazmath/src \
			cocos2dx/kazmath/src/GL \
			cocos2dx/keypad_dispatcher \
			cocos2dx/label_nodes \
			cocos2dx/layers_scenes_transitions_nodes \
			cocos2dx/menu_nodes \
			cocos2dx/misc_nodes \
			cocos2dx/particle_nodes \
			cocos2dx/platform \
			cocos2dx/platform/nacl \
			cocos2dx/script_support \
			cocos2dx/shaders \
			cocos2dx/sprite_nodes \
			cocos2dx/support \
			cocos2dx/support/data_support \
			cocos2dx/support/image_support \
			cocos2dx/support/zip_support \
			cocos2dx/text_input_node \
			cocos2dx/textures \
			cocos2dx/tileMap_parallax_nodes \
			cocos2dx/touch_dispatcher
			
SRC_DIRS := $(addprefix $(INCLUDE_REL)/, $(SRC_DIRS))

COCOS2DX_CPP_OBJS_32 := $(patsubst $(INCLUDE_REL)/%.cpp, ./obj32/%_32.o, $(wildcard $(addsuffix /*.cpp, $(SRC_DIRS))))
COCOS2DX_C_OBJS_32 := $(patsubst $(INCLUDE_REL)/%.c, ./obj32/%_32.o, $(wildcard $(addsuffix /*.c, $(SRC_DIRS))))
COCOS2DX_CPP_OBJS_64 := $(patsubst $(INCLUDE_REL)/%.cpp, ./obj64/%_64.o, $(wildcard $(addsuffix /*.cpp, $(SRC_DIRS))))
COCOS2DX_C_OBJS_64 := $(patsubst $(INCLUDE_REL)/%.c, ./obj64/%_64.o, $(wildcard $(addsuffix /*.c, $(SRC_DIRS))))

$(COCOS2DX_CPP_OBJS_32) : ./obj32/%_32.o : $(INCLUDE_REL)/%.cpp
	$(MKDIR) -p $(dir $@)
	$(CXX) -o $@ -c $< -m32 $(CXXFLAGS) $(INCLUDE_DIRS)
	
$(COCOS2DX_C_OBJS_32) : ./obj32/%_32.o : $(INCLUDE_REL)/%.c
	$(MKDIR) -p $(dir $@)
	$(CXX) -o $@ -c $< -m32 $(CXXFLAGS) $(INCLUDE_DIRS)				

$(COCOS2DX_CPP_OBJS_64) : ./obj64/%_64.o : $(INCLUDE_REL)/%.cpp
	$(MKDIR) -p $(dir $@)
	$(CXX) -o $@ -c $< -m64 $(CXXFLAGS) $(INCLUDE_DIRS)
	
$(COCOS2DX_C_OBJS_64) : ./obj64/%_64.o : $(INCLUDE_REL)/%.c
	$(MKDIR) -p $(dir $@)	
	$(CXX) -o $@ -c $< -m64 $(CXXFLAGS) $(INCLUDE_DIRS)				

HYBRIDGE_INCLUDE_REL := ../../lib/ggframework

HYBRIDGE_INCLUDE_DIRS:= $(HYBRIDGE_INCLUDE_REL)/hybridge $(HYBRIDGE_INCLUDE_REL)/hybridge/platform/nacl
INCLUDE_DIRS += $(addprefix -I, $(HYBRIDGE_INCLUDE_DIRS))

SRC_DIRS := hybridge \
			hybridge/audio \
			hybridge/bridge \
			hybridge/core \
			hybridge/dev \
			hybridge/graphics \
			hybridge/input \
			hybridge/platform \
			hybridge/platform/nacl \
			hybridge/service \
			hybridge/third_party \
			hybridge/third_party/vallocator \
			hybridge/third_party/vapidjson \
			hybridge/util

			
SRC_DIRS := $(addprefix $(HYBRIDGE_INCLUDE_REL)/, $(SRC_DIRS))

HYBRIDGE_CPP_OBJS_32 := $(patsubst $(HYBRIDGE_INCLUDE_REL)/%.cpp, ./obj32/%_32.o, $(wildcard $(addsuffix /*.cpp, $(SRC_DIRS))))
HYBRIDGE_C_OBJS_32 := $(patsubst $(HYBRIDGE_INCLUDE_REL)/%.c, ./obj32/%_32.o, $(wildcard $(addsuffix /*.c, $(SRC_DIRS))))
HYBRIDGE_CPP_OBJS_64 := $(patsubst $(HYBRIDGE_INCLUDE_REL)/%.cpp, ./obj64/%_64.o, $(wildcard $(addsuffix /*.cpp, $(SRC_DIRS))))
HYBRIDGE_C_OBJS_64 := $(patsubst $(HYBRIDGE_INCLUDE_REL)/%.c, ./obj64/%_64.o, $(wildcard $(addsuffix /*.c, $(SRC_DIRS))))

$(HYBRIDGE_CPP_OBJS_32) : ./obj32/%_32.o : $(HYBRIDGE_INCLUDE_REL)/%.cpp
	$(MKDIR) -p $(dir $@)
	$(CXX) -o $@ -c $< -m32 $(CXXFLAGS) $(INCLUDE_DIRS)
	
$(HYBRIDGE_C_OBJS_32) : ./obj32/%_32.o : $(HYBRIDGE_INCLUDE_REL)/%.c
	$(MKDIR) -p $(dir $@)
	$(CXX) -o $@ -c $< -m32 $(CXXFLAGS) $(INCLUDE_DIRS)				

$(HYBRIDGE_CPP_OBJS_64) : ./obj64/%_64.o : $(HYBRIDGE_INCLUDE_REL)/%.cpp
	$(MKDIR) -p $(dir $@)
	$(CXX) -o $@ -c $< -m64 $(CXXFLAGS) $(INCLUDE_DIRS)
	
$(HYBRIDGE_C_OBJS_64) : ./obj64/%_64.o : $(HYBRIDGE_INCLUDE_REL)/%.c
	$(MKDIR) -p $(dir $@)	
	$(CXX) -o $@ -c $< -m64 $(CXXFLAGS) $(INCLUDE_DIRS)				




INCLUDE_REL := .
SRC_DIRS := Classes
SRC_DIRS := $(addprefix $(INCLUDE_REL)/, $(SRC_DIRS))

CLASSES_OBJS_32 := $(patsubst $(INCLUDE_REL)/%.cpp, ./obj32/%_32.o, $(wildcard $(addsuffix /*.cpp, $(SRC_DIRS))))
CLASSES_OBJS_64 := $(patsubst $(INCLUDE_REL)/%.cpp, ./obj64/%_64.o, $(wildcard $(addsuffix /*.cpp, $(SRC_DIRS))))

$(CLASSES_OBJS_32) : ./obj32/%_32.o : $(INCLUDE_REL)/%.cpp
	$(MKDIR) -p $(dir $@)
	$(CXX) -o $@ -c $< -m32 $(CXXFLAGS) $(INCLUDE_DIRS)
		
$(CLASSES_OBJS_64) : ./obj64/%_64.o : $(INCLUDE_REL)/%.cpp
	$(MKDIR) -p $(dir $@)
	$(CXX) -o $@ -c $< -m64 $(CXXFLAGS) $(INCLUDE_DIRS)
		
INCLUDE_DIRS += -I$(INCLUDE_REL)/Classes
	
HELLOWORLD_OBJS_32 := $(patsubst %.cpp, ./obj32/%_32.o, $(wildcard ./*.cpp))
HELLOWORLD_OBJS_64 := $(patsubst %.cpp, ./obj64/%_64.o, $(wildcard ./*.cpp))

$(HELLOWORLD_OBJS_32) : ./obj32/%_32.o : %.cpp
	$(MKDIR) -p $(dir $@)
	$(CXX) -o $@ -c $< -m32 $(CXXFLAGS) $(INCLUDE_DIRS)
		
$(HELLOWORLD_OBJS_64) : ./obj64/%_64.o : %.cpp
	$(MKDIR) -p $(dir $@)
	$(CXX) -o $@ -c $< -m64 $(CXXFLAGS) $(INCLUDE_DIRS)
		
OBJECTS_32 := $(COCOS2DX_CPP_OBJS_32) $(COCOS2DX_C_OBJS_32) $(HYBRIDGE_CPP_OBJS_32) $(HYBRIDGE_C_OBJS_32) $(CLASSES_OBJS_32) $(HELLOWORLD_OBJS_32)
OBJECTS_64 := $(COCOS2DX_CPP_OBJS_64) $(COCOS2DX_C_OBJS_64) $(HYBRIDGE_CPP_OBJS_64) $(HYBRIDGE_C_OBJS_64) $(CLASSES_OBJS_64) $(HELLOWORLD_OBJS_64)

$(PROJECT)_x86_32.nexe : $(OBJECTS_32)
	$(CXX) -o $@ $^ -m32 $(CXXFLAGS) $(LDFLAGS)

$(PROJECT)_x86_64.nexe : $(OBJECTS_64)
	$(CXX) -o $@ $^ -m64 $(CXXFLAGS) $(LDFLAGS)

	
LDFLAGS :=	-lppapi_gles2 -lppapi_cpp -lppapi \
			-lxml2 -lpng12 -ljpeg -ltiff -lz -lnosys
			
clean :
	rm -rf bin obj32
	rm $(PROJECT)_x86_32.nexe
	rm -rf bin obj64
	rm $(PROJECT)_x86_64.nexe
			
# Define a phony rule so it always runs, to build nexe and start up server.
.PHONY: RUN 
RUN: all
	python httpd.py


