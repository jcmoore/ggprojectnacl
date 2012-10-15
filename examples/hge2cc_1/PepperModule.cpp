#include "ppapi/cpp/instance.h"
#include "ppapi/cpp/module.h"

#include <GLES2/gl2.h>
#include "ppapi/gles2/gl2ext_ppapi.h"

#include "PepperInstance.h"

class PepperModule : public pp::Module
{
public:
	PepperModule()
		: pp::Module()
	{
	}
  
	~PepperModule()
	{
		glTerminatePPAPI();
	}

	bool Init()
	{
		return glInitializePPAPI(get_browser_interface()) == GL_TRUE;
	}

	pp::Instance* CreateInstance(PP_Instance instance)
	{
		return new PepperInstance(instance);
	}
};

namespace pp 
{
	Module* CreateModule()
	{
		return new PepperModule();
	}
}

